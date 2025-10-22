let imprimirImpares n =
    [1..n]
    /> seq.map (fun e -> 2*e-1)
    /> seq.iter (Console.WhriteLine)
        printf $"imprimir impares hasta {n}:"


imprimirImpares 10
