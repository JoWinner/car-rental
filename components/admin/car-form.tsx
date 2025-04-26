"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  CarBrand,
  CarCategory,
  CarFeature,
  CarStatus,
  CarTransmission,
} from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { MediaUpload } from "@/components/admin/image-upload";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";

const carFormSchema = z
  .object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    brand: z.nativeEnum(CarBrand),
    model: z.string().min(2, {
      message: "Model must be at least 2 characters.",
    }),
    year: z.coerce.number().min(1900).max(new Date().getFullYear(), {
      message: "Please enter a valid year.",
    }),
    seats: z.coerce.number().min(1, {
      message: "Please enter number of seats.",
    }),
    rentPrice: z.coerce.number().min(0).optional(),
    onSale: z.boolean().default(false),
    salePrice: z.coerce.number().min(0).optional(),
    onRent: z.boolean().default(false),
    category: z.nativeEnum(CarCategory),
    carTransmission: z.nativeEnum(CarTransmission),
    status: z.nativeEnum(CarStatus),
    description: z.string().optional(),
    features: z.array(z.nativeEnum(CarFeature)).default([]),
    images: z
      .array(z.string())
      .min(1, "At least one image is required")
      .max(8, "Maximum 8 images allowed"),
    video: z.string().url().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.onSale && !data.salePrice) {
        return false;
      }
      if (data.onRent && !data.rentPrice) {
        return false;
      }
      return true;
    },
    {
      message: "Price is required when car is put on sale or rent",
      path: ["salePrice"],
    }
  );

interface CarFormProps {
  initialData?: any;
}

export function CarForm({ initialData }: CarFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const defaultValues = initialData
    ? {
        ...initialData,
        features: initialData.features || [],
        images: initialData.images?.map((img: any) => img.url) || [],
      }
    : {
        name: "",
        brand: undefined,
        model: "",
        year: "",
        seats: "",
        rentPrice: "",
        category: undefined,
        carTransmission: undefined,
        status: CarStatus.AVAILABLE,
        description: "",
        features: [],
        images: [],
        video: "",
      };

  const form = useForm<z.infer<typeof carFormSchema>>({
    resolver: zodResolver(carFormSchema),
    defaultValues,
  });

  async function onSubmit(values: z.infer<typeof carFormSchema>) {
    try {
      setIsLoading(true);

      const endpoint = initialData
        ? `/api/cars/${initialData.id}`
        : "/api/cars";
      const method = initialData ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(
          initialData ? "Failed to update car" : "Failed to create car"
        );
      }

      router.push("/admin/cars");
      router.refresh();

      toast.success(initialData ? "Car updated" : "Car created", {
        description: initialData
          ? "Car has been updated successfully."
          : "New car has been added to the fleet.",
      });
    } catch (error) {
      console.error("Error saving car:", error);
      toast.error("Error", {
        description: initialData
          ? "Failed to update car. Please try again."
          : "Failed to create car. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Media</FormLabel>
              <FormControl>
                <MediaUpload
                  value={field.value}
                  disabled={isLoading}
                  onChange={(urls) => field.onChange(urls)}
                  onRemove={(url) =>
                    field.onChange(
                      field.value.filter((current) => current !== url)
                    )
                  }
                  maxFiles={8}
                  onVideoChange={(url) => form.setValue("video", url)}
                  videoUrl={form.watch("video")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Car name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <Input placeholder="Car model" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-row gap-4 w-full">
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Brand</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a brand" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(CarBrand).map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="carTransmission"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Transmission</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select transmission" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(CarTransmission).map((carTransmission) => (
                        <SelectItem
                          key={carTransmission}
                          value={carTransmission}
                        >
                          {carTransmission.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-row gap-4">
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input placeholder="Year" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="seats"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seats</FormLabel>
                  <FormControl>
                    <Input placeholder="4" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

            <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Features</FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-full justify-between"
                        >
                          {field.value.length > 0
                            ? `${field.value.length} features selected`
                            : "Select features"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 h-80 overflow-y-scroll ">
                      <div className="grid gap-4 p-4 ">
                        {Object.values(CarFeature).map((feature) => (
                          <div
                            key={feature}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              checked={field.value.includes(feature)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...field.value, feature]);
                                } else {
                                  field.onChange(
                                    field.value.filter(
                                      (value) => value !== feature
                                    )
                                  );
                                }
                              }}
                            />
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              {feature.replace(/_/g, " ")}
                            </label>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(CarCategory).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

         {/* Availability and Pricing Section */}
         <div className="space-y-4 rounded-lg border p-4">
            <h3 className="text-lg font-medium">Availability & Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Rental Section */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="onRent"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Available for Rent</FormLabel>
                        <FormDescription>
                          Make this car available for rental
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rentPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rental Price (per day)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter rental price"
                          type="number"
                          step="0.01"
                          disabled={!form.watch("onRent")}
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value
                              ? parseFloat(e.target.value)
                              : undefined;
                            field.onChange(value);
                          }}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Sale Section */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="onSale"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Available for Sale</FormLabel>
                        <FormDescription>
                          Put this car up for sale
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sale Price</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter sale price"
                          type="number"
                          step="0.01"
                          disabled={!form.watch("onSale")}
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value
                              ? parseFloat(e.target.value)
                              : undefined;
                            field.onChange(value);
                          }}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
        </div>
        
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Car description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : initialData ? "Update Car" : "Add Car"}
        </Button>
      </form>
    </Form>
  );
}
