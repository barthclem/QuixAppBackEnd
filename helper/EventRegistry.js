"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by barthclem on 11/15/17.
 */
/**
 * Created by barthclem on 11/14/17.
 */
exports.EventRegistry = {
    JOIN_EVENT: 'join',
    JOIN_EVENT_RESPONSE: 'join-response', DISCONNECT_EVENT: 'disconnect'
};
exports.ChatEventRegistry = {
    NEW_MESSAGE_EVENT: 'new-message',
    TYPING_EVENT: 'typing-event',
    I_AM_TYPING_EVENT: 'iamTypingEvent',
    MESSAGE_EVENT: 'message',
    JOIN_EVENT: 'join',
    JOIN_EVENT_RESPONSE: 'join-response',
    CONNECTION_EVENT: 'connection-event',
    DISCONNECTION_EVENT: 'disconnection-event'
};
exports.TimeEventRegistry = {
    TIME_FOR_QUESTION_EXPIRED_EVENT: 'TimeForQuestionExpired',
    START_PAGE_END_EVENT: 'StartPageEnd',
    ENTRY_PAGE_TIMER_STOPPED_EVENT: 'EntryPageTimerStopped',
    INTER_BREAK_FINISHED_EVENT: 'InterBreakFinished',
    QUESTION_ALERT_EVENT: 'QuestionAlert',
    TEAM_BONUS_EVENT: 'TeamBonus',
    TEAM_TURN_EVENT: 'TeamTurn',
    TIME_FOR_BONUS_EXPIRED: 'TimeForBonusExpired'
};
exports.QuizEventRegistry = {
    QUESTION_ANSWERED_EVENT: 'QuestionAnswered',
    QUESTION_SELECTED_EVENT: 'QuestionSelected',
    ANSWERED_LOADED_EVENT: 'AnsweredLoaded',
    BONUS_LOADED_EVENT: 'BonusLoaded',
    BONUS_ATTEMPTED_EVENT: 'BonusAttempted',
    END_OF_QUIZ_EVENT: 'EndOfQuiz',
    START_OF_NEW_CATEGORY: 'StartOfNewCategory',
    USER_DETAILS_TAKEN_EVENT: 'UserDetialsTaken',
    USER_TURN_TO_PICK_QUESION_EVENT: 'UsersTurnToPickQuestion'
};
