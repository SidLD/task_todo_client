
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { getRecords, updateRecordStatus } from '@/lib/api'
import { UserType } from '@/lib/interface'
import { DatePicker } from './_components/date-picker'

type FoodWasteRecord = {
  _id: string
  dateOfWaste: string
  foodCategory: string[]
  otherFoodCategory?: string
  dishesWasted: string[]
  otherDish?: string
  quantity: number
  cost: number
  reasonForWaste: string[]
  otherReason?: string
  notableIngredients?: string[]
  otherIngredient?: string
  temperature: string
  mealType: string
  wasteStage: string
  disposalMethod: string
  otherDisposalMethod?: string
  environmentalConditions?: string
  relevantEvents?: string
  otherRelevantEvents? : string
  additionalComments?: string
  status: 'PENDING' | 'APPROVED' | 'DECLINED'
  userId: UserType
}

export default function FoodWasteApproval() {
  const [records, setRecords] = useState<FoodWasteRecord[]>([])
  const [selectedRecord, setSelectedRecord] = useState<FoodWasteRecord | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)
  const [stallFilter, setStallFilter] = useState('')

  const handleApprove = async (_id: string) => {
    try {
      await updateRecordStatus(_id, {status: 'APPROVED'}).then(() => {
        setRecords(records.map(record => 
          record._id === _id ? { ...record, status: 'APPROVED' } : record
        ))
        setSelectedRecord(null)
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleReject = async (_id: string) => {
    try {
      await updateRecordStatus(_id, {status: 'DECLINED'}).then(() => {
        setRecords(records.map(record => 
          record._id === _id ? { ...record, status: 'DECLINED' } : record
        ))
      setSelectedRecord(null)
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handlePending = async (_id: string) => {
    try {
      await updateRecordStatus(_id, {status: 'PENDING'}).then(() => {
        setRecords(records.map(record => 
          record._id === _id ? { ...record, status: 'PENDING' } : record
        ))
        setSelectedRecord(null)
      })
    } catch (error) {
      console.log(error)
    }
    
  }

  const filteredRecords = records.filter(record => {
    console.log(record)
    const matchesSearch = 
      record.userId.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.userId.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.foodCategory.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase())) ||
      record.dishesWasted.some(dish => dish.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesDate = dateFilter ? new Date(record.dateOfWaste).toDateString() === dateFilter.toDateString() : true
    const matchesStall = stallFilter ? record.userId.username === stallFilter : true

    return matchesSearch && matchesDate && matchesStall
  })

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const {data} = await getRecords({}) as unknown as any
        if(data){
          console.log(data.data)
          setRecords(data.data)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchRecords()
  }, [])

  return (
    <div className="container py-10 mx-auto">
      <h1 className="mb-5 text-2xl font-bold">Food Waste Records Approval</h1>
      <div className="flex flex-col gap-4 mb-4 md:flex-row">
        <div className="flex-1">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search by name, stall, category, or dish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="dateFilter">Filter by Date</Label>
          <DatePicker
            date={dateFilter}
            setDate={setDateFilter}
          />
        </div>
        <div>
          <Label htmlFor="stallFilter">Filter by Stall</Label>
          <Input
            id="stallFilter"
            placeholder="Enter Stall"
            value={stallFilter}
            onChange={(e) => setStallFilter(e.target.value)}
          />
        </div>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Date</TableHead>
              <TableHead>userId</TableHead>
              <TableHead>Stall</TableHead>
              <TableHead>Categories</TableHead>
              <TableHead className="hidden md:table-cell">Dishes</TableHead>
              <TableHead className="hidden sm:table-cell">Quantity (kg)</TableHead>
              <TableHead className="hidden lg:table-cell">Cost</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.map((record) => (
              <TableRow key={record._id}>
                <TableCell className="font-medium">{record.dateOfWaste}</TableCell>
                <TableCell>{record.userId.email}</TableCell>
                <TableCell>{record.userId.username}</TableCell>
                <TableCell>{record.foodCategory.join(', ')}</TableCell>
                <TableCell className="hidden md:table-cell">{record.dishesWasted.join(', ')}</TableCell>
                <TableCell className="hidden sm:table-cell">{record.quantity}</TableCell>
                <TableCell className="hidden lg:table-cell">{record.cost}</TableCell>
                <TableCell>
                  <Badge 
                    variant={record.status === 'APPROVED' ? 'default' : 
                             record.status === 'DECLINED' ? 'destructive' : 'secondary'}
                  >
                    {record.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="mr-2" onClick={() => setSelectedRecord(record)} >
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Food Waste Record Details</DialogTitle>
                        <DialogDescription>
                          Review the details of the food waste record.
                        </DialogDescription>
                      </DialogHeader>
                      <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                        {selectedRecord && (
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold">userId:</h4>
                              <p>{selectedRecord.userId.email}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold">Stall Number:</h4>
                              <p>{selectedRecord.userId.username}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold">Date of Waste:</h4>
                              <p>{selectedRecord.dateOfWaste}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold">Food Categories:</h4>
                              <p>{selectedRecord.foodCategory.join(', ')}</p>
                              {selectedRecord.otherFoodCategory && (
                                <p>Other: {selectedRecord.otherFoodCategory}</p>
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold">Dishes Wasted:</h4>
                              <p>{selectedRecord.dishesWasted.join(', ')}</p>
                              {selectedRecord.otherDish && (
                                <p>Other: {selectedRecord.otherDish}</p>
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold">Quantity:</h4>
                              <p>{selectedRecord.quantity} kg</p>
                            </div>
                            <div>
                              <h4 className="font-semibold">Cost:</h4>
                              <p>₱{selectedRecord.cost}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold">Reason for Waste:</h4>
                              <p>{selectedRecord.reasonForWaste.join(', ')}</p>
                              {selectedRecord.otherReason && (
                                <p>Other: {selectedRecord.otherReason}</p>
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold">Notable Ingredients:</h4>
                              <p>{selectedRecord.notableIngredients?.join(', ') || 'None'}</p>
                              {selectedRecord.otherIngredient && (
                                <p>Other: {selectedRecord.otherIngredient}</p>
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold">Temperature:</h4>
                              <p>{selectedRecord.temperature}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold">Meal Type:</h4>
                              <p>{selectedRecord.mealType}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold">Waste Stage:</h4>
                              <p>{selectedRecord.wasteStage}</p>
                            </div>
  
                            <div>
                              <h4 className="font-semibold">Disposal Method:</h4>
                              <p>{selectedRecord.disposalMethod}</p>
                              {selectedRecord.otherDisposalMethod && (
                                <p>Other: {selectedRecord.otherDisposalMethod}</p>
                              )}
                            </div>
                            {selectedRecord.environmentalConditions && (
                              <div>
                                <h4 className="font-semibold">Environmental Conditions:</h4>
                                <p>{selectedRecord.environmentalConditions}</p>
                              </div>
                            )}
                            {selectedRecord.relevantEvents && (
                              <div>
                                <h4 className="font-semibold">Relevant Events:</h4>
                                <p>{selectedRecord.relevantEvents}</p>
                                {selectedRecord.otherRelevantEvents && (
                                  <p>Other: {selectedRecord.otherRelevantEvents}</p>
                                )}
                              </div>
                            )}
                            {selectedRecord.additionalComments && (
                              <div>
                                <h4 className="font-semibold">Additional Comments:</h4>
                                <p>{selectedRecord.additionalComments}</p>
                              </div>
                            )}
                            <div>
                              <h4 className="font-semibold">Status:</h4>
                              <Badge 
                                variant={selectedRecord.status === 'APPROVED' ? 'default' : 
                                         selectedRecord.status === 'DECLINED' ? 'destructive' : 'secondary'}
                              >
                                {selectedRecord.status}
                              </Badge>
                            </div>
                          </div>
                        )}
                      </ScrollArea>
                      <div className="flex justify-end mt-4 space-x-2">
                        <Button 
                          variant="destructive" 
                          onClick={() => {
                            handleReject(selectedRecord!._id)
                            setSelectedRecord(null)
                          }}
                          disabled={selectedRecord?.status !== 'PENDING'}
                        >
                          Disapprove
                        </Button>
                        <Button 
                          className='ml-2 bg-green-500'
                          onClick={() => {
                            handlePending(selectedRecord!._id)
                            setSelectedRecord(null)
                          }}
                          disabled={selectedRecord?.status == 'PENDING'}
                        >
                          Move To Pending
                        </Button>
                        <Button 
                          onClick={() => {
                            handleApprove(selectedRecord!._id)
                            setSelectedRecord(null)
                          }}
                          disabled={selectedRecord?.status !== 'PENDING'}
                        >
                          Approve
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={() => handleApprove(record._id)}
                    disabled={record.status !== 'PENDING'}
                  >
                    Approve
                  </Button>
                  <Button 
                    className='ml-2 bg-green-500'
                    size="sm" 
                    onClick={() => handlePending(record._id)}
                    disabled={record.status == 'PENDING'}
                  >
                    Move to Pending
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}