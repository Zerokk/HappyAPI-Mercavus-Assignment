import { Model, Document } from 'mongoose';

export abstract class AbstractDAO {

    public model: Model<Document, {}>

    constructor(model:  Model<Document, {}>){
        this.model = model;
    }

    abstract async create(obj: any);
    abstract async read(_id?: string);
    abstract async update(_id: string, newObj: any);
    abstract async delete(_id: string);

    protected validId(id: string): boolean{
        return id.match(/^[0-9a-fA-F]{24}$/) ? true : false;
    }

}