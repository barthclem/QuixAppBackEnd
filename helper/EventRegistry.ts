/**
 * Created by barthclem on 11/15/17.
 */
/**
 * Created by barthclem on 11/14/17.
 */
export const EventRegistry = {
    JOIN_EVENT : 'join',
    JOIN_EVENT_RESPONSE : 'join-response', DISCONNECT_EVENT : 'disconnect'
};

export const ChatEventRegistry = {
    NEW_MESSAGE_EVENT : 'new-message',
    TYPING_EVENT : 'typing-event',
    I_AM_TYPING_EVENT : 'iamTypingEvent',
    MESSAGE_EVENT : 'message',
    JOIN_EVENT : 'join',
    JOIN_EVENT_RESPONSE : 'join-response',
    CONNECTION_EVENT : 'connection-event',
    DISCONNECTION_EVENT : 'disconnection-event'
};

export const TimeEventRegistry = {
    TIME_FOR_QUESTION_EXPIRED_EVENT : 'TimeForQuestionExpired',
    START_PAGE_END_EVENT : 'StartPageEnd',
    ENTRY_PAGE_TIMER_STOPPED_EVENT : 'EntryPageTimerStopped',
    ENTRY_PAGE_TIMER_STOPPED_RESPONSE: 'EntryPageTimerStoppedResponse',
    ENTRY_PAGE_TIMER_STARTED_EVENT: 'EntryPageTimerStarted',
    STOP_TIMER_EVENT: 'StopTimerEvent',
    ONLINE_TIME_RESPONSE: 'OnlineTimeResponse',
    INTER_BREAK_FINISHED_EVENT : 'InterBreakFinished',
    QUESTION_ALERT_EVENT : 'QuestionAlert',
    TEAM_BONUS_EVENT : 'TeamBonus',
    TEAM_TURN_EVENT : 'TeamTurn',
    TIME_FOR_BONUS_EXPIRED : 'TimeForBonusExpired'
};

export const QuizEventRegistry = {
    PICK_NOTIFY_TEAM: 'PickNotifyTeam',
    PICK_NOTIFY_ALL: 'PickNotifyAll',
    QUESTION_ANSWERED_EVENT : 'QuestionAnswered',
    QUESTION_SELECTED_EVENT : 'QuestionSelected',
    ANSWERED_LOADED_EVENT : 'AnsweredLoaded',
    QUESTION_LOADED_EVENT : 'QuestionLoaded',
    BONUS_LOADED_EVENT : 'BonusLoaded',
    BONUS_ATTEMPTED_EVENT : 'BonusAttempted',
    END_OF_QUIZ_EVENT : 'EndOfQuiz',
    START_OF_NEW_CATEGORY : 'StartOfNewCategory',
    END_OF_CATEGORY : 'EndOfACategory',
    USER_DETAILS_TAKEN_EVENT : 'UserDetialsTaken',
    USER_TURN_TO_PICK_QUESTION_EVENT : 'UsersTurnToPickQuestion'
};

export const NavEventRegistry = {
    UPDATE_SCORE: 'UpdateScore'
};