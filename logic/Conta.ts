export default abstract class Conta{

    private _nome: string = "";
    private _endereco: string = "";
    private _cpf: string = "";
    private _email: string = "";


    private _numbanco: number = 0.0;
    private _numconta: number = 0.0;
    private _saque: number = 0.0;
    private _deposito: number = 0.0;
    private _saldo: number = 0.0;


    public get nome(): string {
        return this._nome;
    }
    public set nome(value: string) {
        this._nome = value;
    }
    
    public get endereco(): string {
        return this._endereco;
    }
    public set endereco(value: string) {
        this._endereco = value;
    }
    
    public get cpf(): string {
        return this._cpf;
    }
    public set cpf(value: string) {
        this._cpf = value;
    }
    
    public get email(): string {
        return this._email;
    }
    public set email(value: string) {
        this._email = value;
    }
    
    public get numbanco(): number {
        return this._numbanco;
    }
    public set numbanco(value: number) {
        this._numbanco = value;
    }
    
    public get numconta(): number {
        return this._numconta;
    }
    public set numconta(value: number) {
        this._numconta = value;
    }
    
    public get saque(): number {
        return this._saque;
    }
    public set saque(value: number) {
        this._saque = value;
    }
    
    public get deposito(): number {
        return this._deposito;
    }
    public set deposito(value: number) {
        this._deposito = value;
    }
    
    public get saldo(): number {
        return this._saldo;
    }
    public set saldo(value: number) {
        this._saldo = value;
    }

    

        
    

}