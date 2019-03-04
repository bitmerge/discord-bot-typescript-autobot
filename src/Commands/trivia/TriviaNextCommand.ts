// @ts-ignore
import { Message }                                 from 'discord.js';
import { Command, CommandMessage, CommandoClient } from 'discord.js-commando';
import 'moment-duration-format';
import { TriviaQuestion }                          from '../../db/entity/TriviaQuestion';
import { DB }                                      from '../../index';

export default class TriviaNextCommand extends Command {

    public constructor(client: CommandoClient) {

        super(client, {

            name: 'trivia.next',
            aliases: [ 'trivia.next' ],
            group: 'trivia',
            memberName: 'trivia.next',
            description: 'Asks a trivia question',
            guildOnly: false,
            throttling: {

                usages: 1,
                duration: 30000

            }

        });

    }

    // @ts-ignore
    public async run(message: CommandMessage): Promise<Message | Message[]> {

        let question: TriviaQuestion;

        const matches = message.content.match(/(\d+)/);

        if (!!matches) {

            question = await DB.getRepository(TriviaQuestion)
                               .createQueryBuilder('trivia_question')
                               .select([ 'id', 'question', 'answer' ])
                               .where('id = :id', { id: matches[ 1 ] })
                               .getRawOne();

        } else {

            question = await DB.getRepository(TriviaQuestion)
                               .createQueryBuilder('trivia_question')
                               .select([ 'id', 'question', 'answer' ])
                               .orderBy('RAND()')
                               .limit(1)
                               .getRawOne();

        }

        const filter = (response: any) => {

            return question.answer ? 'true' === response.content.toLowerCase() : 'false' == response.content.toLowerCase();

        };

        message.channel.sendEmbed({

            color: 3447003,
            description: `True or False: **${ question.question }**`

        }).then(() => {

            message.channel
                   .awaitMessages(filter, { maxMatches: 1, time: 60 * 60 * 1000, errors: [ 'time' ] })
                   .then(collected => {

                       message.channel.send(`Woohoo <@${ collected.first().author.id }>! You got the correct answer!`);

                   })
                   .catch(collected => {

                       message.channel.send(`Looks like nobody got the answer this time. The correct answer was '${ question.answer ? 'true' : 'false' }'.`);

                   });

        });

    }

}
