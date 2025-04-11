#include <stdio.h>
int main(){
    int n;
    printf("\nenter the num of inputs: ");
    scanf("%d",&n);

    for(int i=1;i<=n;i++){
        printf("\n\n%dst input\n",i);
        int N,S,W,E;
    int northSignal,southSignal,westSignal,eastSignal;
    

    printf("enter the vehicles in north: ");
    scanf("%d",&N);

     printf("enter the vehicles in south: ");
    scanf("%d",&S);

     printf("enter the vehicles in east: ");
    scanf("%d",&E);

     printf("enter the vehicles in west: ");
    scanf("%d",&W);

    if(N>S && N>W && N>E){
        printf("South = Green");
        printf("\nNorth=Red");
        printf("\nWest=Red");
        printf("\nEast=Red");


    }
    else if(E>W && E>S && E>N){
        printf("West = Green");
        printf("\nSouth = Red");
        printf("\nNorth=Red");
    
        printf("\nEast=Red");
    }
      if(W>S && W>N && W>E){
        printf("East = Green");
    printf("\nSouth = Red");
        printf("\nNorth=Red");
        printf("\nWest=Red");
  

    }
    else if(S>W && S>E && S>N){
        printf("North = Green");
          printf("\nSouth = Red");
        printf("\nEast=Red");
        printf("\nWest=Red");
  
    }
    
    }
    

    
    

 



}