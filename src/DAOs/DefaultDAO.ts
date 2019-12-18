import { AbstractDAO } from "./AbstractDAO";

export class DefaultDAO extends AbstractDAO {

    async create(obj: any) {
        const created = await this.model.create(obj);
        created.save();
        return created._id;
    }

    async read(_id?: string) {
        if (_id) {
            if (!this.validId(_id)) {
                throw "Invalid ID provided"
            }
            return this.model.findById(_id).exec();
        } else {
            return this.model.find().exec();
        }
    }

    async update(_id: string, newObj: any) {
        if(this.validId(_id)){
            await this.model.updateOne({_id: _id}, newObj);

        }else{
            throw "This object did not previously exist";
        }
    }

    async delete(_id: string) {
        if(this.validId(_id)){
            await this.model.deleteOne({_id: _id});

        }else{
            throw "This object did not previously exist";
        }
    }


}