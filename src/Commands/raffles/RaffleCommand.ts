import { Message }                                 from 'discord.js';
import { Command, CommandMessage, CommandoClient } from 'discord.js-commando';

export default class LMGTFYCommand extends Command {

    public constructor(client: CommandoClient) {

        super(client, {

            name: 'raffle',
            aliases: [ 'raffle' ],
            group: 'raffle',
            memberName: 'raffle',
            description: 'Displays current raffle information.',
            guildOnly: false,
            throttling: {

                usages: 2,
                duration: 30

            }

        });

    }

    public async run(msg: CommandMessage): Promise<Message | Message[]> {

        return msg.embed({

            color: 3447003,
            description: 'Bitmerge Monthly Raffle',
            fields: [ {

                name: '❯ This months raffle',
                value: `HUGE humblebundle giveaway by one of our members (https://www.humblebundle.com/books/coders-bookshelf-books). Use \`> raffleadd\` to get your hat in the ring! Raffles results will be announced at the end of the month.`,
                inline: true

            } ]

        });

    }

}
