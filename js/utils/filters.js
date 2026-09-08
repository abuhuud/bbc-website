/**
 * Filter helpers for players, events, and news
 */
function filterPlayersByGender(playerList, gender) {
    if (!gender || gender === 'all' || gender === 'semua') {
        return playerList;
    }
    return playerList.filter(p => p.gender.toLowerCase() === gender.toLowerCase());
}

function filterEventsByType(eventList, type) {
    if (!type || type === 'all' || type === 'semua') {
        return eventList;
    }
    return eventList.filter(e => e.type.toLowerCase() === type.toLowerCase());
}

function filterNewsByCategory(articleList, category) {
    if (!category || category === 'all' || category === 'semua') {
        return articleList;
    }
    return articleList.filter(a => a.category.toLowerCase() === category.toLowerCase());
}
