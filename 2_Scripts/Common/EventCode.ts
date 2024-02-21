const EventCode = {
    SERVER: {
        EVENT: "EVENT",
        GENERATE_TOKEN: "GENERATE_TOKEN",
        RECEIVED_TOKEN: "RECEIVED_TOKEN",
        TOKEN_EXISTED: "TOKEN_IS_ALREADY_EXIST",
        WEB_SOCKET_OPEN: "ARCADE_EVENT.NETWORK.WEB_SOCKET_OPEN",
        IDENTIFY: "IDENTIFY_ACCOUNT",
        LOGIN: "LOGIN",
        PING:"PING",
        PONG:"PONG",
    },

    REQUEST: {

    },

    RESPONSE: {
        JOIN_GAME_RESULT: 'client-join-game-result',
        CLAIM_GAME: 'c',
        FIRED_EVENT: 'cd',
        NORMAL_GAME: 'n',
        FREE_GAME: 'f',
        PLAYER_INFO_UPDATE: 'piu',
    },

    STATE: {
        PREPARING: 'PREPARING',
        WIN: 'WIN',
        LOST: 'LOST',
    }

}


export default EventCode;