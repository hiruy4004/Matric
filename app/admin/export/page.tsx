"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Download, Lock, Table, Upload } from "lucide-react"
import { exportUsersToSheet } from "@/lib/sheets"

// Admin credentials - in a real app, this would be in a secure environment variable
const ADMIN_EMAIL = "admin@practicearena.com"

export default function ExportPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<string | null>(null)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    // Check if user is admin
    if (!user || user.email !== ADMIN_EMAIL) {
      router.push("/")
    }
  }, [user, router])

  const handleExportCsv = async () => {
    try {
      setLoading(true)
      setError(null)
      await exportUsersToSheet(true)
    } catch (err) {
      setError("Failed to export users to CSV")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateSheet = async () => {
    try {
      setLoading(true)
      setError(null)
      await exportUsersToSheet(false)
      setLastUpdate(new Date().toLocaleString())
    } catch (err) {
      setError("Failed to update Google Sheet")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-[400px]">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <Lock className="h-12 w-12 text-destructive" />
              <h2 className="text-2xl font-bold">Access Denied</h2>
              <p className="text-muted-foreground">
                You do not have permission to access this page.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Table className="h-6 w-6" />
            <CardTitle>Export User Data</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-4 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          )}
          
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Google Sheets Integration</h3>
              <p className="text-muted-foreground">
                Update the Google Sheet with the latest user data. The sheet is automatically updated every 6 hours.
              </p>
              {lastUpdate && (
                <p className="text-sm text-muted-foreground">
                  Last updated: {lastUpdate}
                </p>
              )}
              <Button
                onClick={handleUpdateSheet}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                {loading ? "Updating..." : "Update Google Sheet"}
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Download CSV</h3>
              <p className="text-muted-foreground">
                Download user data as a CSV file that you can import into any spreadsheet software.
              </p>
              <Button
                onClick={handleExportCsv}
                disabled={loading}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                {loading ? "Exporting..." : "Export to CSV"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 