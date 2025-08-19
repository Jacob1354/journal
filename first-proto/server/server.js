import Database from "better-sqlite3";
import { AuthService } from "./services/auth_sevice";
import { JournalService } from "./services/journal_service";

export class JournalServer {
    
    constructor() {
        this.db = new Database("journaldb.db");
        this.auth_service = new AuthService(this.db);
        this.journal_service = new JournalService(this.db);
    }

    close_server() {
        this.db.close();
    }
}