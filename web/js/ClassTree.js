/**
 * Class tree representation.
 * @param {CacheUMLExplorer} parent
 * @param {HTMLElement} treeViewContainer
 * @constructor
 */
var ClassTree = function (parent, treeViewContainer) {

    this.cacheUMLExplorer = parent;
    this.container = treeViewContainer;
    this.loader = null;
    this.SELECTED_CLASS_NAME = null;
    this.SELECTED_ELEMENT = null;

};

ClassTree.prototype.showLoader = function () {

    if (this.loader) return;

    this.loader = document.createElement("div");
    this.loader.className = "spinner";
    this.container.appendChild(this.loader);

};

ClassTree.prototype.removeLoader = function () {

    if (!this.loader) return;
    this.loader.parentNode.removeChild(this.loader);
    this.loader = null;

};

ClassTree.prototype.classSelected = function (element, className) {

    this.SELECTED_CLASS_NAME = className;

    if (element !== this.SELECTED_ELEMENT) {
        if (this.SELECTED_ELEMENT) this.SELECTED_ELEMENT.classList.remove("selected");
        this.SELECTED_ELEMENT = element;
    }

    if (!element.classList.contains("selected")) {
        element.classList.add("selected");
        this.cacheUMLExplorer.classView.loadClass(className);
    }

};

ClassTree.prototype.packageSelected = function (element, packageName) {

    if (element !== this.SELECTED_ELEMENT) {
        if (this.SELECTED_ELEMENT) this.SELECTED_ELEMENT.classList.remove("selected");
        this.SELECTED_ELEMENT = element;
    }

    if (!element.classList.contains("selected")) {
        element.classList.add("selected");
        this.cacheUMLExplorer.classView.loadPackage(packageName);
    }

};

ClassTree.prototype.updateTree = function (treeObject) {

    var self = this,
        div = function () { return document.createElement("div"); };

    var packageClick = function (e) {

        var el = e.target || e.srcElement;

        if (el.className.match(/minimized/)) {
            el.className = el.className.replace(/\s+?minimized/, "");
        } else {
            el.className += " minimized";
        }

    };

    var classClick = function (e) {

        var el = e.target || e.srcElement;

        self.classSelected(el, el.CLASS_NAME);

    };

    var append = function (rootElement, elementName, isPackage, path) {

        var el1 = div(),
            el2, el3, el4;

        if (isPackage) {
            el1.className = "tv-package";
            (el2 = div()).className = "tv-package-name minimized"; el2.textContent = elementName;
            (el3 = div()).className = "tv-package-content";
            el1.appendChild(el2); el1.appendChild(el3);
            el2.addEventListener("click", packageClick);
            el2.appendChild(el4 = div());
            el4.className = "tv-rightListIcon icon list";
            el4.addEventListener("click", function () {
                self.packageSelected(el1, (path ? path + "." : path) + elementName);
            });
        } else {
            el1.className = "tv-class-name";
            el1.textContent = elementName;
            el1.addEventListener("click", classClick);
            el1.CLASS_NAME = path + (path ? "." : "") + elementName;
        }

        rootElement.appendChild(el1);

        return el3 ? el3 : null;

    };

    var build = function (rootElement, object, path) {

        var i, element, rec,
            arr = [];

        for (i in object) {
            arr.push({ name: i, val: object[i] });
        }

        arr.sort(function (a, b) {
            if (typeof a.val !== typeof b.val) return typeof a.val === "object" ? -1 : 1;
            return a.name > b.name ? 1 : -1;
        });

        for (i in arr) {
            element = arr[i];
            if (rec = append(
                    rootElement,
                    element.name,
                    typeof element.val === "object",
                    path.join(".")
                )) {
                build(rec, element.val, path.concat([element.name]));
            }
        }

    };

    build(this.container, treeObject, []);

    this.removeLoader();

};