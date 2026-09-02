import Conta from './Conta';
import IContas, { IAbrir , ICliente } from './IConta';





export default class Corrente extends Conta implements IContas ,IAbrir{

    abrirconta(cli: ICliente): void {

        this.cpf = cli._cpf ;
        this.email = cli._email ;
        this.nome = cli._nome ;
        this.endereco = cli._endereco ;
    }
    depositar(valor: number): number {

        this.saldo += valor;

        return this.saldo;
    }
    sacar(valor: number): number {
        this.saldo -= valor;
        
        return this.saldo ;
    }
    saldos(): number {
        return this.saldo;
    }
  
     

}