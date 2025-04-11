
import React from "react";
import { Check, CreditCard } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SubscriptionPlan } from "@/types/subscriptions";
import { toast } from "sonner";

type PlanCardProps = {
  plan: SubscriptionPlan;
  onSubscribe: (planId: string) => void;
};

const PlanCard = ({ plan, onSubscribe }: PlanCardProps) => {
  const handleSubscribe = () => {
    console.info(`Subscribing to plan: ${plan.id}`);
    onSubscribe(plan.id);
    toast.success(`Subscribed to ${plan.name} plan!`);
  };

  return (
    <Card 
      className={`flex flex-col h-full ${plan.recommended ? 'border-primary shadow-md relative' : ''}`}
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
                  <Check className="h-4 w-4 mr-2 text-primary flex-shrink-0 mt-1" />
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
          onClick={handleSubscribe}
          variant={plan.recommended ? "default" : "outline"}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Subscribe
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PlanCard;
