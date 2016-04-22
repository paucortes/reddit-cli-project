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
    {name: "Hot topics first", value: "HOT"},
    {name: "New topics first", value: "NEW"},
    {name: "Rising topics first", value: "RISING"},
    {name: "Controversial topics first", value: "CONTR"},
    {name: "Top topics first", value: "TOP"},
    {name: "Guilded topics first", value: "GUILD"},
    {name: "No sorting, just give me the home page!", value: "HOMEPAGE"},
];

var subredditSorting = [
    {name: "Hot topics first", value: "HOT"},
    {name: "New topics first", value: "NEW"},
    {name: "Rising topics first", value: "RISING"},
    {name: "Controversial topics first", value: "CONTR"},
    {name: "Top topics first", value: "TOP"},
    {name: "Guilded topics first", value: "GUILD"},
    {name: "No sorting, just give me the subreddit page!", value: "SUBREDDIT"},
];

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
                switch (answers2.homepage) {
                    case ("HOT"):
                        sortedHome("hot", function(res){
                            console.log(res);
                            menu();
                        });
                        break;
                    case ("NEW"):
                        sortedHome("new", function(res){
                            console.log(res);
                            menu();
                        });
                        break;
                    case ("RISING"):
                        sortedHome("rising", function(res){
                            console.log(res);
                            menu();
                        });
                        break;
                    case ("CONTR"):
                        sortedHome("controversial", function(res){
                            console.log(res);
                            menu();
                        });
                        break;
                    case ("TOP"):
                        sortedHome("top", function(res){
                            console.log(res);
                            menu();
                        });
                        break;
                    case ("GUILD"):
                        sortedHome("guilded", function(res){
                            console.log(res);
                            menu();
                        });
                        break;
                    case ("HOMEPAGE"):
                        homePage(function(res) {
                            console.log(res);
                            menu();
                        });
                        break;
                }
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
            var listOfSubreddits = [];
            subredditLists(function(result) {
                for (var i = 0; i < result.length; i++) {
                    var split = result[i].url.split("/");
                    for (var j = 0; j < split.length; j++) {
                        if (listOfSubreddits.indexOf(split[2]) === -1) {
                            listOfSubreddits.push(split[2]);
                        }
                    }
                }
                var arrayobjects = [new inquirer.Separator(), {
                    name: "Back to Main Menu",
                    value: "BACKTOMENU"
                }, new inquirer.Separator()];
                listOfSubreddits.reduce(function(prev, curr) {
                    arrayobjects.push({
                        name: curr,
                        value: curr.toUpperCase()
                    });
                }, arrayobjects);
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
                        }).then(function(answers4) {
                            switch (answers4.sortedsubreddits) {
                                case ("HOT"):
                                    sortedSubreddit(answers3.subreddits, "hot", function(res) {
                                        console.log(res);
                                        menu();
                                    });
                                    break;
                                case ("NEW"):
                                    sortedSubreddit(answers3.subreddits, "new", function(res) {
                                        console.log(res);
                                        menu();
                                    });
                                    break;
                                case ("RISING"):
                                    sortedSubreddit(answers3.subreddits, "rising", function(res) {
                                        console.log(res);
                                        menu();
                                    });
                                    break;
                                case ("CONTR"):
                                    sortedSubreddit(answers3.subreddits, "controversial", function(res) {
                                        console.log(res);
                                        menu();
                                    });
                                    break;
                                case ("TOP"):
                                    sortedSubreddit(answers3.subreddits, "top", function(res) {
                                        console.log(res);
                                        menu();
                                    });
                                    break;
                                case ("GUILD"):
                                    sortedSubreddit(answers3.subreddits, "guilded", function(res) {
                                        console.log(res);
                                        menu();
                                    });
                                    break;
                                case ("SUBREDDIT"):
                                    subReddit(answers3.subreddits, function(res) {
                                        console.log(res);
                                        menu();
                                    });
                                    break;
                            }
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


