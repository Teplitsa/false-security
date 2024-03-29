Vue.component('logfalsics', {
    props: [
        'record'
    ],
    template: `
        <span class="logfalsics">(<span v-if="record.damage">-</span>{{record.damage}}<span class="falsic"></span>)</span>
    `
});
Vue.component('log', {
    props: [
        'cards',
        'log',
        'players',
    ],
    computed: {
        def_value: function () {
            if (!this.vs) {
                return 0;
            }
            return this.card.def_against.filter((x) => x.other_card == this.vs)[0].value;
        },

    },
    methods: {
        get_player_name: function (player_id) {
            player = this.players.filter(obj => {return obj.id === player_id})[0];
            if (player){
                return this.players.filter(obj => {return obj.id === player_id})[0].name;
            } else {
                return undefined;
            }
        },
        popup: function(card) { 
            MicroModal.close('modalLog');
            cardBig.show(card.id);
        },
        get_smooth_log: function(){
            smooth_log = [];
            for (round in this.log) {
                for (battle of this.log[round].battles) {
                    offender = this.get_player_name(battle.offender);
                    accident = (typeof offender === 'undefined') ? true : false;
                    if (this.cards[battle.offensive_card]) {
                        offensive_card = {name: this.cards[battle.offensive_card].name, id: battle.offensive_card};
                    } else {
                        offensive_card = {name: '', id:-1};
                    }

                    defensive_cards = [];
                    if (battle.defensive_cards) {
                        for (card of battle.defensive_cards) {
                            defensive_cards.push({name: this.cards[card].name, id: card});
                        }
                    }
                    if (battle.is_complete === true) {
                        smooth_log.push({
                            'defender': this.get_player_name(battle.defender),
                            'offender': offender,
                            'defensive_cards': defensive_cards,
                            'offensive_card': offensive_card,
                            'accident': accident,
                            'damage': battle.damage_remains
                        });
                    }
                }
            }
            return smooth_log;
        }
    },
    template: `
    <div class="log window-cell">
                    <!-- <div class="log_header">События в игре:</div> -->
                    <div class="log_body auto_scroll_down">
                        <div class="log_record" v-for="record in get_smooth_log()">
                            <div v-if="record.accident">
                                <div v-if="record.defensive_cards.length" class="marker">
                                    ⚔ Игрок <span class="green_text">{{record.defender}}</span> отбился от атаки карты
                                    случайности <span class="blue_text card_in_text" @click="popup(record.offensive_card);" >{{record.offensive_card.name}}</span>
                                    с помощью <span v-for="(card, index) in record.defensive_cards" @click="popup(card);" class="green_text card_in_text">{{card.name}}<span v-if="index+1 < record.defensive_cards.length">, </span></span> <logfalsics :record="record"><br><br>
                                </div>
                                <div v-else class="marker">
                                    ⚔ Игрок <span class="green_text">{{record.defender}}</span> не смог отбиться от
                                    атаки
                                    карты случайности <span class="blue_text card_in_text" @click="popup(record.offensive_card);" >{{record.offensive_card.name}}</span> <logfalsics :record="record"><br><br>
                                </div>
                            </div>
                            <div v-else>
                                <div v-if="record.defensive_cards.length" class="marker">
                                    ⚔ Игрок <span class="green_text">{{record.defender}}</span> отбился от атаки карты
                                    <span class="red_text card_in_text" @click="popup(record.offensive_card);" >{{record.offensive_card.name}}</span> игрока
                                    <span class="red_text">{{record.offender}}</span>
                                    с помощью <span v-for="(card, index) in record.defensive_cards" @click="popup(card);" class="green_text card_in_text">{{card.name}}<span v-if="index+1 < record.defensive_cards.length">, </span></span> <logfalsics :record="record"><br><br>
                                </div>
                                <div v-else class="marker">
                                    ⚔ Игрок <span class="green_text">{{record.defender}}</span> не смог отбиться от
                                    атаки
                                    карты <span class="red_text card_in_text" @click="popup(record.offensive_card);">{{record.offensive_card.name}}</span> игрока
                                    <span class="red_text">{{record.offender}}</span> <logfalsics :record="record"><br><br>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
`
});


