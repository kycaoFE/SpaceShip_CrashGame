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
        JOIN_GAME_RESULT: 'jgr',
        CLAIM_GAME: 'c',
        FIRED_EVENT: 'cd',
        NORMAL_GAME: 'n',
        PLAYER_INFO_UPDATE: 'piu',
    }

}


export default EventCode;