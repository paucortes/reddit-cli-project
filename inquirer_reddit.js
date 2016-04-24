var getReddit = require('./node_modules/reddit/reddit.js');
var image = require("image-to-ascii");
var colors = require('colors');
var img2ascii = require('img2ascii');

var homePage = getReddit.gethomepage; // callback
var sortedHome = getReddit.getsortedhomepage; // sortingmethod, callback
var subReddit = getReddit.getsubreddit; // subreddit, callback
var sortedSubreddit = getReddit.getsortedsubreddit; // subreddit, sortingMethod, callback
var allSubreddits = getReddit.getsubreddits; // callback
var subredditLists = getReddit.subredditlist; // callback

var inquirer = require('inquirer');

var menuChoices = [
    {name: "Show homepage", value: "HOMEPAGE"},
    {name: "Show specific subreddit", value: "SUBREDDIT"},
    {name: "List subreddits of newest posts", value: "SUBREDDITS"},
    {name: "Quit", value: "EXIT"}
];

var homePageSorting = [
    {name: "Hot topics first", value: "hot"},
    {name: "New topics first", value: "new"},
    {name: "Rising topics first", value: "rising"},
    {name: "Controversial topics first", value: "controversial"},
    {name: "Top topics first", value: "top"},
    {name: "Guilded topics first", value: "guilded"},
    {name: "No sorting, just give me the home page!", value: "hot"},
];

var subredditSorting = [
    {name: "Hot topics first", value: "hot"},
    {name: "New topics first", value: "new"},
    {name: "Rising topics first", value: "rising"},
    {name: "Controversial topics first", value: "controversial"},
    {name: "Top topics first", value: "top"},
    {name: "Guilded topics first", value: "guilded"},
    {name: "No sorting, just give me the subreddit page!", value: "hot"},
];

function firstQuestion() {
    
}

// Menu
function menu() {
        inquirer.prompt({
                type: "list",
                name: "menu",
                message: "What do you want to do?",
                choices: menuChoices
        }).then(function(answers) {
            if (answers.menu === "HOMEPAGE") {
                inquirer.prompt({
                    type: "list",
                    name: "homepage",
                    message: "How would you like to organize the results?",
                    choices: homePageSorting
                }).then(function(answers2) {
                    sortedHome(answers2.homepage, function(res) {
                        console.log(res);
                        menu();
                    });
                });
            }
            else if (answers.menu === "SUBREDDIT") {
                function userImput() {
                    inquirer.prompt({
                        type: "input",
                        name: "selectsub",
                        message: "Type in the subreddit that you want to access"
                    }).then(function(userAnswer) {
                        subReddit(userAnswer.selectsub, function(res) {
                            if (res === "Looks like that is not a valid subreddit. Check your spelling and try again!") {
                                console.log(res);
                                userImput();
                            }
                            else {
                                console.log(res);
                                menu();
                            }
                        });
            
                    });
                }
                userImput();
            }
            else if (answers.menu === "SUBREDDITS") {
                var arrayobjects = [new inquirer.Separator(), {
                            name: "Back to Main Menu",
                            value: "BACKTOMENU"
                        }, new inquirer.Separator()];
                subredditLists(function(result) {
                var array = [];
                result.map(function(item) {
                    return array.push(item.url.split("/")[2]);
                });
                var uniqueStrings = [];
                array.forEach(function(element) {
                    if (uniqueStrings.indexOf(element) === -1) {
                        uniqueStrings.push(element);
                    }
                });
                uniqueStrings.forEach(function(element) {
                    return arrayobjects.push({
                                    name: element,
                                    value: element}); 
                });
                inquirer.prompt({
                type: "list",
                name: "subreddits",
                message: "Select a subreddit",
                choices: arrayobjects
                }).then(function(answers3) {
                    if (answers3.subreddits === "BACKTOMENU") {
                        menu();
                    }
                    else {
                        inquirer.prompt({
                            type: "list",
                            name: "sortedsubreddits",
                            message: "How would you like to organize the results?",
                            choices: subredditSorting
                        }).then(function(sortingAnswer) {
                            sortedSubreddit(answers3.subreddits, sortingAnswer.sortedsubreddits, function(res) {
                                console.log(res);
                                menu();
                        });
                        });
                    }
                });
                });
            }
            else if (answers.menu === "EXIT") {
            console.log("Thank you for using Reddit for console. Until next time!");
            }
        });
} menu();
