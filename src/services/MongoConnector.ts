import * as Mongoose from 'mongoose';

export class MongoConnector {

    public connection: Mongoose.Connection;
    private database_url: string;
    private database_port: number;
    private db_name: string;

    constructor(database_url: string, database_port: number, db_name?:string) {
        this.database_url = database_url;
        this.database_port = database_port;
        this.db_name = db_name;
    }

    /**
     * Connect to the database assigned by object's constructor.
     * Note: use synchronically, since Mongoose buffers all database operations.
     * @param options (Optional) Connection options for the Mongo Client.
     */
    public connect(options?: Mongoose.ConnectionOptions) {
        if (!options) {
            options = { useNewUrlParser: true }
        }
        let connString = `mongodb://${this.database_url}:${this.database_port}`;
        if(this.db_name) connString += '/'+this.db_name;
        Mongoose.connect(connString, options);
        this.connection = Mongoose.connection;
        this.defaultHandlers();
    }

    /**
     * Add a custom event handler to the Mongo connection
     * @param event Event name (check event names in Mongo specification).
     * @param handler Function that will handle the specified event.
     */
    public addCustomEventHandler(event: string, handler: any) {
        if (event && handler) {
            try {
                this.connection.on(event, handler);
            }catch(err){
                console.log("[MongoConnector] Error registering custom event handler: ", err)
            }
        }
    }

    private defaultHandlers() {
        this.connection.on('error', () => console.log("[MongoConnector] Error in Mongo connection."));
        this.connection.once('open', () => console.log("[MongoConnector] Correctly established Mongo connection."));
    }

}