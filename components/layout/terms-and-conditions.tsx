import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TermsAndConditions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>OUR TERMS AND CONDITIONS</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div>
          {/* <h3 className="font-semibold mb-2">CHAUFFEURED RENTAL:</h3> */}
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="font-medium">Rental Period:</span> All
              chauffeured rides are calculated for 12 hours per day. Drivers
              finish work by 8pm for rentals that start from at least mid-noon.
            </li>
            <li>
              <span className="font-medium">Overtime Fee:</span> Rentals that
              exceed 8pm will incur an overtime fee. This fee is half the day's
              rate for rentals that go from 8pm to 11pm, and a full day
              extension rate for those that go beyond 11pm.
            </li>
            <li>
              <span className="font-medium">Driver Allowance:</span> Rental
              rates include the allowance for the driver.
            </li>
            <li>
              <span className="font-medium">Accommodation:</span> If the
              chauffeured ride extends beyond a day outside Accra, accommodation
              will be needed. Clients can choose to provide accommodation for
              the driver or have the accommodation cost added to the quoted
              rate.
            </li>
            <li>
              <span className="font-medium">Fuel:</span> Fuel rates are not
              included in the rental amount. Clients are required to refill the
              fuel tank after each trip.
            </li>
            <li>
              <span className="font-medium">Payment:</span> Full payment is
              required before the car is delivered. We do not accept cash
              payments. Payment should be made via transfer methods such as
              Mobile Money, Bank Transfer, or Card payment.
            </li>
            <li>
              <span className="font-medium">Cancellation:</span> Clients will
              incur a cancellation fee of at least GHC 200 if a car is booked
              and cancelled less than 48 hours before booking date.
            </li>
            <li>
              <span className="font-medium">Usage:</span> Outside Accra trips
              costs extra, as rates are based on the destination.
            </li>
          </ul>
        </div>
        <div className="text-xs text-muted-foreground">
          <p className="font-medium">NOTE:</p>
          <p>
            For multiple location bookings across Regions in Ghana, please
            contact support directly to assist with your booking. Contact
            support via the enquiry or support@domain.com
          </p>
        </div>
        <div className="text-xs text-muted-foreground">
          <p>
            Kindly read FAQs (https://domain.com/faq) to answer additional
            questions about this car.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
