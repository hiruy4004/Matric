"use client"

import { google } from "googleapis"
import schedule from "node-schedule"

// Configuration
const SPREADSHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID
const SHEET_NAME = "User Data"
const REFRESH_INTERVAL = "0 */6 * * *" // Every 6 hours

interface UserData {
  id: string
  name: string
  email: string
  createdAt: string
  emailVerified: boolean
  lastLoginTime?: number
  loginAttempts: number
  lockedUntil?: number
  quizResults?: {
    mathScore: number
    englishScore: number
    totalAttempts: number
    lastAttempt?: string
  }
}

// Initialize Google Sheets API
async function getGoogleSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_EMAIL,
      private_key: process.env.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  })

  const sheets = google.sheets({ version: "v4", auth })
  return sheets
}

// Format user data for sheets
function formatUserData(users: UserData[]) {
  const headers = [
    "ID",
    "Name",
    "Email",
    "Joined Date",
    "Email Verified",
    "Last Login",
    "Login Attempts",
    "Status",
    "Math Score",
    "English Score",
    "Total Quiz Attempts",
    "Last Quiz Attempt"
  ]

  const rows = users.map(user => [
    user.id,
    user.name,
    user.email,
    new Date(user.createdAt).toLocaleDateString(),
    user.emailVerified ? "Yes" : "No",
    user.lastLoginTime ? new Date(user.lastLoginTime).toLocaleString() : "Never",
    user.loginAttempts,
    user.lockedUntil && user.lockedUntil > Date.now() ? "Locked" : "Active",
    user.quizResults?.mathScore || 0,
    user.quizResults?.englishScore || 0,
    user.quizResults?.totalAttempts || 0,
    user.quizResults?.lastAttempt || "Never"
  ])

  return [headers, ...rows]
}

// Update Google Sheet
async function updateSheet(data: any[][]) {
  try {
    const sheets = await getGoogleSheetsClient()

    // Clear existing data
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:L`,
    })

    // Update with new data
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: data,
      },
    })

    // Auto-resize columns
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [{
          autoResizeDimensions: {
            dimensions: {
              sheetId: 0,
              dimension: "COLUMNS",
              startIndex: 0,
              endIndex: 12
            }
          }
        }]
      }
    })

    return true
  } catch (error) {
    console.error("Error updating sheet:", error)
    throw error
  }
}

// Export users to Google Sheet
export async function exportUsersToSheet(downloadCsv = false) {
  // Get users from localStorage
  const users = localStorage.getItem("practice_arena_users")
  if (!users) return null

  const parsedUsers: UserData[] = JSON.parse(users)
  const formattedData = formatUserData(parsedUsers)

  if (downloadCsv) {
    // Create CSV content
    const csvContent = formattedData
      .map(row => row.map(cell => JSON.stringify(cell)).join(","))
      .join("\n")

    // Create a Blob containing the CSV data
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)

    // Create a link to download the CSV
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `practice_arena_users_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } else {
    // Update Google Sheet
    await updateSheet(formattedData)
  }
}

// Schedule automatic updates
export function scheduleUpdates() {
  if (typeof window === "undefined") return

  // Schedule updates every 6 hours
  schedule.scheduleJob(REFRESH_INTERVAL, async () => {
    try {
      await exportUsersToSheet()
      console.log("Scheduled update completed:", new Date().toLocaleString())
    } catch (error) {
      console.error("Scheduled update failed:", error)
    }
  })
}

// Initialize scheduled updates
scheduleUpdates() 