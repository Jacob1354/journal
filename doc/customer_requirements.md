# Customer requirements

## Description
The aim of this project is to create a scheduling tool combined with a mood journal
for a day to day basis and a global mood/health overview. The idea is to make it sufficiently 
flexible to easily fit the needs of various users.

## General requirements/overview
 1. Saved calendar with all the info of every day accessible
 2. For each day, have a schedule of the daily tasks split in segments with a 5 mins precision 
 3. For each day, record mood ratings and comments. By default, this should include:
    - Hours of sleep
    - Hapiness rating from 1 to 10
    - Energy rating from 1 to 10 
    - Extra notes section
 4. Flexible user experience. That is, all the mood related fields must be customizable. 
    The user must be able to delete them, add some new ones, modify their name, content style or signification

## Platform requirements
 1. The most important platform would be a responsive website, since it's most flexible.
    Any one's of the followings would just be a plus
 2. Cellphone app
 3. Desktop app

 ## Components/Pages
There will be 6 different components :
 1. Login page: asks for email and password
 2. Calendar: All the days of a month, able to switch months through arrows, by clicking the month or the year
 3. Specific day: With visuals explained in the previous segment
 4. Template: Page letting the user organise the mood related ratings they want and default values
 5. Account params: Changing some info such as the name, lastname, password, email, etc.
 6. Summary: The user must be able to have access to a summary of their mood, health and productivity for a specific time interval

## Scheduling requirements
 1. Precision : To begin, an hourly precision is acceptable. For the finished product, a 5 mins precision is required. Should'nt be more precise than by the minute.
 2. Visual : It needs to be as simple as possible. Customizabilty would be a plus, but not essential. The format should be in the form of a time ascending list. For desktop screens, the schedule should on the left (refer to the design image reference) and the mood recordings on the right and under. For smaller devices, the schedule should be on the top of the page and the mood recordings under.

## Mood related requirements
 1. By default, have: hours of sleep, hapiness rating, energy rating, comment section
 2. The user must be able to add, delete or modify sections
 3. The available types usable by the user must be: plain text, number, slider, number rating (ex: x/10)

## Summary requirements
An important use of this app is to compile and analyse the mood, health and productivity data of the user. Those are the features the summary component should implement:
 1. For the schedule, the app should show:
    1. The average and median time spent doing things
    2. The number of hours and percentage(compared to the number of hours awake and the number of active hours) of time spent doing each type of tasks
 3. For the numeric ratings, give average and median values
 4. For the slider ratings, give average and median values using a slider
 5. Number and percentage of days during which the user has actually used the app properly. This feature should also show it for every section (schedule, ratings) to show the accuracy of the data
 6. An easy way for the user to select which info they want to see and which they'd rather hide. This visibility mask should be saved.

## Account/User info
The following data should be saved:
 1. Email
 2. Password
 3. Phone number
 4. First name
 5. Last name
 6. Date of birth
 7. Date beginning using this app (not shown to the user)
 8. City
 9. Country
 10. Gender (facultative)