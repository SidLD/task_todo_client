
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { createRecord } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { useNavigate } from 'react-router-dom'

const formSchema = z.object({
  dateOfWaste: z.string().nonempty('Date of Waste is required'),
  foodCategory: z.array(z.string()).min(1, 'At least one food category is required'),
  otherFoodCategory: z.string().optional(),
  dishesWasted: z.array(z.string()).min(1, 'At least one dish must be selected'),
  otherDish: z.string().optional(),
  quantity: z.number().min(0.1, 'Quantity must be at least 0.1 kg'),
  cost: z.number().min(1, 'Cost must be at least 1'),
  reasonForWaste: z.array(z.string()).min(1, 'At least one reason is required'),
  otherReason: z.string().optional(),
  notableIngredients: z.array(z.string()).optional(),
  otherIngredient: z.string().optional(),
  temperature: z.string().nonempty('Temperature is required'),
  mealType: z.string().nonempty('Meal type is required'),
  wasteStage: z.string().nonempty('Waste stage is required'),
  disposalMethod: z.string().nonempty('Disposal method is required'),
  otherDisposalMethod: z.string().optional(),
  environmentalConditions: z.string().optional(),
  relevantEvents: z.string().optional(),
  otherRelevantEvents: z.string().optional(),
  additionalComments: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

const foodCategories = ['Rice', 'Vegetables', 'Fruits', 'Meat', 'Seafood', 'Baked Goods', 'Drinks', 'Processed Foods', 'Other']
const dishes = ['Adobo', 'Menudo', 'Afritada', 'Caldereta', 'Pork Steak', 'Bicol Express', 'Tinola', 'Paksiw', 'Sari-Sari', 'Pinakbet', 'Pakbet', 'Dinuguan', 'Other']
const wasteReasons = ['Expired', 'Spoilage', 'Over-preparation', 'Improper Storage', 'Contamination', 'Quality Issues', 'Excessive Stock', 'Unused Leftovers', 'Other']
const notableIngredients = ['Coconut Milk', 'Milk', 'Other']
const temperatures = ['Hot', 'Normal', 'Cold', `Didn't Notice`]
const mealTypes = ['Breakfast Foods', 'Lunch Foods', 'Merienda Foods']
const wasteStages = ['50% Consumer & 50% Food Stalls', 'More on Consumers side', 'More on Food Stalls side']
const disposalMethods = ['Thrown Away & to be Collected', 'Composted', 'Used for Animal Feed', 'Other']
const relevantEvents = ['University Intramurals', 'City Festival', 'Charity Events', 'Foundation Day', 'Acquaintance Party', 'Other']

export default function ContributorDataEntry() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      foodCategory: [],
      dishesWasted: [],
      reasonForWaste: [],
      notableIngredients: [],
    },
  })

  async function onSubmit(formData: FormValues) {
    try {
      console.log('Form Data:', formData)
      const {data} = await createRecord(formData) as unknown as any;
      
      toast({
        title: "Success",
        description: "New Data",
      })
      navigate('/contributor')
      console.log(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Error",
      })
      console.log(error)
      
    }
  }

  return (
    <TooltipProvider>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-4xl p-8 mx-auto space-y-8 bg-white border rounded-lg shadow-lg">
          <FormField
            control={form.control}
            name="dateOfWaste"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Waste</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormDescription>
                  On what date did the food waste occur? (MM/DD/YYYY)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="foodCategory"
            render={() => (
              <FormItem>
                <FormLabel>Food Category</FormLabel>
                <FormDescription>
                  What type of food was wasted?
                </FormDescription>
                {foodCategories.map((category) => (
                  <FormField
                    key={category}
                    control={form.control}
                    name="foodCategory"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={category}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(category)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, category])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== category
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {category}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch('foodCategory').includes('Other') && (
            <FormField
              control={form.control}
              name="otherFoodCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Other Food Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Please specify other category" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="dishesWasted"
            render={() => (
              <FormItem>
                <FormLabel>Dishes Wasted</FormLabel>
                <FormDescription>
                  What type dish or prepared dishes was wasted?
                </FormDescription>
                {dishes.map((dish) => (
                  <FormField
                    key={dish}
                    control={form.control}
                    name="dishesWasted"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={dish}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(dish)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, dish])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== dish
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {dish}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch('dishesWasted').includes('Other') && (
            <FormField
              control={form.control}
              name="otherDish"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Other Dish</FormLabel>
                  <FormControl>
                    <Input placeholder="Please specify other dish" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity of Food Waste (in kg)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                </FormControl>
                <FormDescription>
                  How much food was wasted?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cost of Wasted Food</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                </FormControl>
                <FormDescription>
                  What is the estimated cost of the wasted food?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reasonForWaste"
            render={() => (
              <FormItem>
                <FormLabel>Reason for Waste</FormLabel>
                <FormDescription>
                  What was the primary reason for the food being wasted?
                </FormDescription>
                {wasteReasons.map((reason) => (
                  <FormField
                    key={reason}
                    control={form.control}
                    name="reasonForWaste"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={reason}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(reason)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, reason])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== reason
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {reason}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch('reasonForWaste').includes('Other') && (
            <FormField
              control={form.control}
              name="otherReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Other Reason</FormLabel>
                  <FormControl>
                    <Input placeholder="Please specify other reason" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="notableIngredients"
            render={() => (
              <FormItem>
                <FormLabel>Notable Ingredients (optional)</FormLabel>
                <FormDescription>
                  What was some of the notable food ingredients that could play a role for the food being wasted?
                </FormDescription>
                {notableIngredients.map((ingredient) => (
                  <FormField
                    key={ingredient}
                    control={form.control}
                    name="notableIngredients"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={ingredient}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(ingredient)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value as any, ingredient])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== ingredient
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {ingredient}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch('notableIngredients')?.includes('Other') && (
            <FormField
              control={form.control}
              name="otherIngredient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Other Notable Ingredient</FormLabel>
                  <FormControl>
                    <Input placeholder="Please specify other notable ingredient" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="temperature"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Temperature Factor</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Temperature" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {temperatures.map((temp) => (
                      <SelectItem key={temp} value={temp}>
                        {temp}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  What was the surrounding temperature around at that day when the food waste happened?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mealType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meal Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Meal Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mealTypes.map((meal) => (
                      <SelectItem key={meal} value={meal}>
                        {meal}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  During which Meal was the most waste generated?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="wasteStage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stage at Which Waste Occurred</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Waste Stage" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {wasteStages.map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        {stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  <Tooltip>
                    <TooltipTrigger>At what stage in the food cycle did the waste occur? Retail Stage or Consumer Stage?</TooltipTrigger>
                    <TooltipContent>
                      <p>Retail Stage is when FW was on the side of Restaurants and Food Courts while Consumer Stage is when FW was on the side of the Customer or Consumer.</p>
                    </TooltipContent>
                  </Tooltip>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="disposalMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Method of Disposal</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Disposal Method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {disposalMethods.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  How was the food waste disposed of?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch('disposalMethod') === 'Other' && (
            <FormField
              control={form.control}
              name="otherDisposalMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Other Disposal Method</FormLabel>
                  <FormControl>
                    <Input placeholder="Please specify other disposal method" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="environmentalConditions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Environmental Conditions</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Please specify any environmental conditions"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Were there any specific environmental conditions that contributed to the waste? (Ex. Power Outage, Spoilage due to Weather, Refrigeration Issues, etc.)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

        <FormField
          control={form.control}
          name="relevantEvents"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Relevant Events</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Event" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {relevantEvents.map((event) => (
                    <SelectItem key={event} value={event}>
                      {event}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                What were the Events that could possibly play a factor on the Food Waste?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch('relevantEvents') === 'Other' && (
          <FormField
            control={form.control}
            name="otherRelevantEvents"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Other Relevant Event</FormLabel>
                <FormControl>
                  <Input placeholder="Please specify other relevant event" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

          <FormField
            control={form.control}
            name="additionalComments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Comments (optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any additional comments or observations"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Please provide any additional details or context regarding the food waste.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">Submit</Button>
        </form>
      </Form>

      <Toaster  />
    </TooltipProvider>
  )
}