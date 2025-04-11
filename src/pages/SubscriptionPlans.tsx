
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CreditCard, Check, Shield } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

const plans = [
  {
    id: "silver",
    name: "Silver",
    level: "basic",
    price: 500,
    recommended: false,
    benefits: [
      "Help rescue 1 stray animal",
      "Monthly impact report",
      "Name on our website"
    ],
    featuresIncluded: [
      "Basic animal tracking",
      "Community access",
      "5 report notifications per day"
    ]
  },
  {
    id: "gold",
    name: "Gold",
    level: "standard",
    price: 1000,
    recommended: true,
    benefits: [
      "Help rescue 3 stray animals",
      "Detailed monthly impact report",
      "Featured name on our website",
      "Exclusive newsletter"
    ],
    featuresIncluded: [
      "Advanced animal tracking",
      "Priority community access",
      "15 report notifications per day",
      "Custom notification radius"
    ]
  },
  {
    id: "platinum",
    name: "Platinum",
    level: "premium",
    price: 2000,
    recommended: false,
    benefits: [
      "Help rescue 7 stray animals",
      "Comprehensive impact reports",
      "Featured logo on our website",
      "Exclusive event invitations",
      "Certificate of appreciation"
    ],
    featuresIncluded: [
      "Premium animal tracking",
      "VIP community access",
      "Unlimited report notifications",
      "Custom notification settings",
      "Direct contact with rescue teams"
    ]
  }
];

const SubscriptionPlans = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = (planId: string) => {
    setSubscribing(true);
    
    // Simulate subscription process
    setTimeout(() => {
      setSubscribing(false);
      toast.success(`Successfully subscribed to the ${planId.charAt(0).toUpperCase() + planId.slice(1)} plan!`);
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Sponsor Animal Rescue</h1>
          <p className="text-muted-foreground mt-2">
            Choose a sponsorship plan to help rescue and care for stray animals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-20">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`flex flex-col h-full ${
                plan.recommended ? 'border-primary shadow-lg relative' : ''
              }`}
            >
              {plan.recommended && (
                <Badge className="absolute -top-2 right-4 bg-primary">
                  Recommended
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{plan.name}</span>
                  <Badge variant="outline" className="capitalize">
                    {plan.level}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">₹{plan.price}</span>
                    <span className="text-muted-foreground ml-1">/month</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Benefits</h3>
                    <ul className="space-y-2">
                      {plan.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start">
                          <Check className="h-4 w-4 mr-2 text-primary flex-shrink-0 mt-1" />
                          <span className="text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Features Included</h3>
                    <ul className="space-y-2">
                      {plan.featuresIncluded.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <Shield className="h-4 w-4 mr-2 text-primary flex-shrink-0 mt-1" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleSubscribe(plan.id)}
                  variant={plan.recommended ? "default" : "outline"}
                  disabled={subscribing}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  {subscribing ? "Processing..." : "Subscribe Now"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default SubscriptionPlans;
