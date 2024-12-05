import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const OrderSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center space-y-4 pb-0">
          <FaCheckCircle className="text-green-500 w-24 h-24" />
          <h1 className="text-3xl font-bold text-gray-800 text-center">
            Order Confirmed!
          </h1>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div>
            <p className="text-gray-600 mb-4">
              Thank you for your purchase. Your order has been successfully
              processed.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              {/* <p className="text-green-700 font-semibold">
                Order Number: #12345
              </p> */}
              <p className="text-green-600">
                We'll send you a confirmation email shortly
              </p>
            </div>
          </div>
          <div className="flex flex-col space-y-4">
            <Button asChild>
              <Link to="/orders">View Order Details</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/">Continue Shopping</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSuccess;
