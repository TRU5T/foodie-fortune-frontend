
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, AlertCircle, Award } from "lucide-react";
import { Link } from "react-router-dom";

const Cart = () => {
  const { items, updateQuantity, removeItem, clearCart, subtotal } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  const deliveryFee = 2.99;
  const taxRate = 0.0825;
  const tax = subtotal * taxRate;
  const total = subtotal + deliveryFee + tax;
  const pointsEarned = Math.round(total * 10);
  
  const handleCheckout = () => {
    // Ordering is not yet enabled — checkout is disabled.
  };
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
      <div className="mb-8 rounded-lg border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium">Online ordering is coming soon</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            For now, visit participating restaurants in person and scan your Redeemr QR code to collect loyalty.
          </p>
        </div>
      </div>
      
      {items.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Trash2 className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Looks like you haven't added any items to your cart yet.</p>
          <Button asChild><Link to="/restaurants">Browse Restaurants</Link></Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader><CardTitle>Cart Items ({items.length})</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="rounded-md w-20 h-20 object-cover" />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus className="h-4 w-4" /></Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="h-4 w-4" /></Button>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground" onClick={() => removeItem(item.id)}>
                          <Trash2 className="h-4 w-4 mr-1" />Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" onClick={clearCart}>Clear Cart</Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card>
              <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Delivery Fee</span><span>${deliveryFee.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>${tax.toFixed(2)}</span></div>
                  <Separator />
                  <div className="flex justify-between font-medium"><span>Total</span><span>${total.toFixed(2)}</span></div>
                  <div className="flex items-center gap-2 text-sm text-accent-foreground bg-accent/10 p-2 rounded">
                    <Award className="h-4 w-4 text-accent" />
                    <span>You'll earn {pointsEarned} points with this order!</span>
                  </div>
                  <div className="bg-muted p-4 rounded-lg flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">Ordering isn't live yet. Checkout is disabled.</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleCheckout} disabled>
                  Coming Soon
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
