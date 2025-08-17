const storyTemplates = [
    "Once upon a time, {emoji1} met {emoji2} at a magical place where {emoji3} was shining bright. They discovered {emoji4} hidden behind {emoji5}, and together they found {emoji6} waiting for them.",
    "In a distant land, {emoji1} and {emoji2} embarked on an adventure. They climbed over {emoji3}, swam through {emoji4}, and finally reached {emoji5} where {emoji6} was waiting.",
    "The story begins when {emoji1} decided to visit {emoji2}. Along the way, they encountered {emoji3}, made friends with {emoji4}, danced with {emoji5}, and celebrated with {emoji6}.",
    "Long ago, {emoji1} had a dream about {emoji2}. In this dream, {emoji3} showed them the way to {emoji4}, where {emoji5} and {emoji6} were having a wonderful time.",
    "Every morning, {emoji1} would wake up and see {emoji2} outside the window. Today was special because {emoji3} brought {emoji4}, {emoji5}, and {emoji6} to play together."
];


function generateStory(selectedEmojis) {
    if (selectedEmojis.length === 0) {
        return 'Your memory story will appear here once you select emojis.';
    }

    const template = storyTemplates[Math.floor(Math.random() * storyTemplates.length)];
    let story = template;
    
    selectedEmojis.forEach((emoji, index) => {
        story = story.replace(`{emoji${index + 1}}`, emoji);
    });

   
    story = story.replace(/\{emoji\d+\}/g, '🌟');
    
    return story;
}