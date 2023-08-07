$(document).ready(function() {
    document.getElementById("downloadTSVButton").addEventListener("click", downloadTSV);
});

downloadTSV = () => {
    startLoader();

    let userQuery = window.location.search.split(/\?userQuery./g)[1].replaceAll("%3D", "=").replaceAll("%26", "&").replaceAll("%3A", ":");
    let tsvText = "title\tDOI\tis-referenced-by-count\tsubject\tcontainer-title\n" // tsv headers 

    initialQuery = (userQuery, tsvText) => {$.ajax({
        url: `https://api.crossref.org/works?${userQuery}&cursor=*`,
        success: function (data) {
            window.queryResult;
            queryResult = data // caches query as queryResult

            items = queryResult["message"]["items"]

            if (items.length>0){
                for (item of items) {
                    title = item["title"] || "Not provided"
                    tsvText += JSON.stringify(title).replace(/\n/g, "").replace(/\s+/g, ' ').trim()
                    tsvText += "\t"
                    doiNumber = item["DOI"] || "Not provided"
                    tsvText += JSON.stringify(doiNumber).replace(/\n/g, "").replace(/\s+/g, ' ').trim()
                    tsvText += "\t"
                    referenceCount = item["is-referenced-by-count"] || "Not provided"
                    tsvText += JSON.stringify(referenceCount).replace(/\n/g, "").replace(/\s+/g, ' ').trim()
                    tsvText += "\t"
                    subject = item["subject"] || "Not provided"
                    tsvText += JSON.stringify(subject).replace(/\n/g, "").replace(/\s+/g, ' ').trim()
                    tsvText += "\t"
                    containerTitle = item["container-title"] || "Not provided"
                    tsvText += JSON.stringify(containerTitle).replace(/\n/g, "").replace(/\s+/g, ' ').trim()
                    tsvText += "\n"
                }
                nextCursor = queryResult["message"]["next-cursor"]
                urlNext = `https://api.crossref.org/works?${userQuery}&cursor=${nextCursor}`
                nextQuery(urlNext)
            }
        }})}

    nextQuery = (urlNext) => {$.ajax({
        url: urlNext,
        success: function (data) {
            window.queryResult;
            queryResult = data // caches query as queryResult

            items = queryResult["message"]["items"]

            if (items.length>0){
                for (item of items) {
                    title = item["title"] || "Not provided"
                    tsvText += JSON.stringify(title).replace(/\n/g, "").replace(/\s+/g, ' ').trim()
                    tsvText += "\t"
                    doiNumber = item["DOI"] || "Not provided"
                    tsvText += JSON.stringify(doiNumber).replace(/\n/g, "").replace(/\s+/g, ' ').trim()
                    tsvText += "\t"
                    referenceCount = item["is-referenced-by-count"] || "Not provided"
                    tsvText += JSON.stringify(referenceCount).replace(/\n/g, "").replace(/\s+/g, ' ').trim()
                    tsvText += "\t"
                    subject = item["subject"] || "Not provided"
                    tsvText += JSON.stringify(subject).replace(/\n/g, "").replace(/\s+/g, ' ').trim()
                    tsvText += "\t"
                    containerTitle = item["container-title"] || "Not provided"
                    tsvText += JSON.stringify(containerTitle).replace(/\n/g, "").replace(/\s+/g, ' ').trim()
                    tsvText += "\n"
                }
                nextQuery(urlNext)
            } else {
                console.log("All queries complete");
                removeLoader();
                downloadFile(tsvText);
            }
        }})}
    
    downloadFile = (tsvText) => {
        // Download the xlsx file.
        let a = document.createElement("a");
        a.setAttribute("href", 'data:text/tab-separated-values;charset=utf-8,' + encodeURIComponent(tsvText));
        a.setAttribute("download", "Downloaded from Crossref Dashboard.tsv");
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    initialQuery(userQuery, tsvText)
}

startLoader = () => {
    window.loaderDiv
    loaderDiv = document.createElement("div");
    loaderDiv.className = "loaderDiv";
    loaderDiv.innerHTML += "<span class=\"loaderText\"></span>"
    document.body.prepend(loaderDiv);
}

removeLoader = () => {
    loaderDiv.remove();
}