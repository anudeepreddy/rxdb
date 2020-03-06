import { RxPlugin, RxCollectionCreator } from '../../types';

import {
    ERROR_MESSAGES
} from './error-messages';
import {
    checkSchema
} from './check-schema';
import { checkOrmMethods } from './check-orm';
import { checkMigrationStrategies } from './check-migration-strategies';


export const RxDBDevModePlugin: RxPlugin = {
    rxdb: true,
    overwritable: {
        tunnelErrorMessage(code: string) {
            if (!ERROR_MESSAGES[code]) {
                console.error('RxDB: Error-Code not known: ' + code);
                throw new Error('Error-Cdoe ' + code + ' not known, contact the maintainer');
            }
            return ERROR_MESSAGES[code];
        }
    },
    hooks: {
        preCreateRxSchema: checkSchema,
        createRxCollection: (args: RxCollectionCreator) => {
            // check ORM-methods
            checkOrmMethods(args.statics);
            checkOrmMethods(args.methods);
            checkOrmMethods(args.attachments);

            // check migration strategies
            if (args.schema && args.migrationStrategies) {
                checkMigrationStrategies(
                    args.schema,
                    args.migrationStrategies
                );
            }
        }
    }
};
