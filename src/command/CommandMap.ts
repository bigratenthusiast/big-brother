import {Ping} from "./commands/Ping";
import {ICommand} from "./ICommand";
import {Join} from "./commands/Join";
import {Leave} from "./commands/Leave";
import {Amalgomate} from "./commands/Amalgomate";

export class CommandMap {
    // TODO: Use reflection instead
    public static registerCommands():ICommand[] {
        return [
            Ping,
            Join,
            Leave,
            Amalgomate
        ];
    }
}