const angular = require('angular');

angular.module('reg')
    .constant('EVENT_INFO', {
        NAME: 'PickHacks 2020',
    })
    .constant('DASHBOARD', {
        UNVERIFIED: 'You should have received an email asking you verify your email. Click the link in the email and you can start your application!',
        INCOMPLETE_TITLE: 'You still need to complete your application!',
        INCOMPLETE: 'If you do not complete your application before the Thursday, April 8th 2021, 11:59 PM CST, you will not be considered for the admission!',
        SUBMITTED_TITLE: 'Your application has been submitted!',
        SUBMITTED: 'Feel free to edit it at any time. However, once registration is closed, you will not be able to edit it any further.\nAdmissions will be reviewed at a later date. Please make sure your information is accurate before registration is closed!',
        CLOSED_AND_INCOMPLETE_TITLE: 'Unfortunately, registration has closed, and the selection process has begun.',
        CLOSED_AND_INCOMPLETE: 'Because you have not completed your profile in time, you will not be eligible for the selection process.',
        ADMITTED_AND_CAN_CONFIRM_TITLE: 'You must confirm by Thursday, April 8th 2021, 11:59 PM CST.',
        ADMITTED_AND_CANNOT_CONFIRM_TITLE: 'Your confirmation deadline of Thursday, April 8th 2021, 11:59 PM CST has passed.',
        ADMITTED_AND_CANNOT_CONFIRM: 'Although you were accepted, you did not complete your confirmation in time.\nUnfortunately, this means that you will not be able to attend the event, as we must begin to accept other applicants on the waitlist.\nWe hope to see you again next year!',
        CONFIRMED_NOT_PAST_TITLE: 'You can edit your confirmation information until Thursday, April 8th 2021, 11:59 PM CST',
        CHECKEDIN: 'Welcome to PickHacks! Can\'t wait to see what you build!',
	DECLINED: 'We\'re sorry to hear that you won\'t be able to make it to PickHacks 2021! :(\nMaybe next year! We hope you see you again soon.',
        REJECTED: 'We regret to inform you that we cannot offer you a spot at PickHacks 2021. Thank you so much for your interest and application - we appreciate you taking the time to apply.',
    })
    .constant('TEAM',{
        NO_TEAM_REG_CLOSED: 'Unfortunately, it\'s too late to enter the event with a team.\nHowever, you can still form teams on your own before or during the event!',
    });
