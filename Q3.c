#include <stdio.h>

int main() {
    int a, b;
    int *p1, *p2;

    
    printf("Enter two numbers: ");
    scanf("%d,%d", &a, &b);

   
    p1 = &a;
    p2 = &b;

   
    printf("Addition: %d\n", (*p1) + (*p2));
    printf("Subtraction: %d\n", (*p1) - (*p2));
    printf("Multiplication: %d\n", (*p1) * (*p2));

    if (*p2 != 0) {
        printf("Division: %.2f\n", (float)(*p1) / (*p2));
        
    } else {
        printf("Division: Cannot divide by zero.\n");
    }

    return 0;
}