/*
* Function to load the PDFs onto a canvas
*
 */


// HACK few hacks to let PDF.js be loaded not as a module in global space
/*
global.window = global;
global.PDFJS = {};
global.navigator = { userAgent: "node"};
global.DOMParser = require('./domparsermock.js').DOMParserMock;
*/

require('./pdf-combined.js');


var loadPdf = function(id, pdfLocation) {
    console.log('Loading pdf');


    var url = pdfLocation,
        pdfDoc = null,
        pageNum = 1,
        pageRendering = false,
        pageNumPending = null,
        scale = 1.2,
        canvas = document.getElementById(id),
        ctx = canvas.getContext('2d');
    /*
     * Get page info from document, resize canvas according, and render page
     * @param num Page number.
     */
    function renderPage(num) {
        pageRendering = true;
        // Using promise to fetch the page
        pdfDoc.getPage(num).then(function (page) {
            var viewport = page.getViewport(scale);
            canvas.height = viewport.height;
            // Render PDF page into canvas context
            var renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };
            var renderTask = page.render(renderContext);
            // Wait for rendering to finish
            renderTask.promise.then(function () {
                pageRendering = false;
                if (pageNumPending !== null) {
                    // New page rendering is pending
                    renderPage(pageNumPending);
                    pageNumPending = null;
                }
            });
        });
        // Update page counters
        document.getElementById('page_num').textContent = pageNum;
    }

    /*
     * If another page is rendering in progress, wait until the rendering is
     * finished. Otherwise, execute immediately.
     */
    function queueRenderPage(num) {
        if (pageRendering) {
            pageNumPending = num;
        } else {
            renderPage(num);
        }
    }

    /*
     * Displays previous page
     */
    function onPrevPage() {
        if (pageNum <= 1) {
            return;
        }
        pageNum--;
        queueRenderPage(pageNum);
    }

    document.getElementById('prev').addEventListener('click', onPrevPage);
    /*
     * Displays next page
     */
    function onNextPage() {
        if (pageNum >= pdfDoc.numPages) {
            return;
        }
        pageNum++;
        queueRenderPage(pageNum);
    }

    document.getElementById('next').addEventListener('click', onNextPage);

    /*
     * Asynchronously downloads PDF
     */
    PDFJS.getDocument(url).then(function (pdfDoc_) {
        pdfDoc = pdfDoc_;
        document.getElementById('page_count').textContent = pdfDoc.numPages;
        // Initial/first page rendering
        renderPage(pageNum);
    });
};

/*
loadPdf('canvasNum1', '../pdfs/S_amber.pdf');
loadPdf('canvasNum2', '../pdfs/U_amber.pdf');
 */