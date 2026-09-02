import Corrente from "./Corrente";
import Poupanca from "./Poupanca";
import Salario from "./Salario";

class Principal {
    
    teste: string ="";
    main(): void{

        const ccore = new Corrente();
        const cpoup = new Poupanca();
        const csal = new Salario();

        ccore.saldo = 7000.15;



        csal.saldo=100;

        csal.depositar(256.1);

        

        console.log(csal.saldos())

        csal.sacar(300);
        
        console.log(csal.saldos())

    

    }

    
}
    const app  = new Principal();
    app.main();