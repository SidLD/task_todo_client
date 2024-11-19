
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Toaster } from '@/components/ui/toaster'
import { getContributorStat } from '@/lib/api'

interface FoodWasteEntry {
  _id: string;
  dateOfWaste: string;
  foodCategory: string[];
  dishesWasted: string[];
  quantity: number;
  cost: number;
  reasonForWaste: string[];
  relevantEvents: string;
  status: string;
}


export default function ContributorDashboardView() {
  const [entries, setEntries] = useState<FoodWasteEntry[]>([])

  const fetchEntries = async () => {
    try {
      const {data} = await getContributorStat({}) as unknown as any;
      setEntries(data.data)
    } catch (err) {
      console.error('Error fetching entries:', err)
    }
  }

  // const handleDelete = async (id: string) => {
  //   try {
  //     await deleteRecord({recordId: id})
  //     await fetchEntries()
  //     toast({
  //       title: "Entry Deleted",
  //       description: "The food waste entry has been successfully deleted.",
  //     })
  //   } catch (err) {
  //     toast({
  //       title: "Error",
  //       description: "Failed to delete the entry. Please try again.",
  //       variant: "destructive",
  //     })
  //     console.error('Error deleting entry:', err)
  //   }
  // }

  useEffect(() => {
    void fetchEntries()
  }, [])

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Contributor Dashboard</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Total Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{entries.length}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Food Waste Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Food Categories</TableHead>
                <TableHead>Dishes Wasted</TableHead>
                <TableHead>Quantity (kg)</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Reasons</TableHead>
                <TableHead>Relevant Event</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry._id}>
                  <TableCell>{entry.dateOfWaste}</TableCell>
                  <TableCell>{entry.foodCategory.join(', ')}</TableCell>
                  <TableCell>{entry.dishesWasted.join(', ')}</TableCell>
                  <TableCell>{entry.quantity}</TableCell>
                  <TableCell>₱{entry.cost.toFixed(2)}</TableCell>
                  <TableCell>{entry.reasonForWaste.join(', ')}</TableCell>
                  <TableCell>{entry.relevantEvents}</TableCell>
                  <TableCell>{entry.status}</TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <Toaster />
      </Card>
    </div>
  )
}