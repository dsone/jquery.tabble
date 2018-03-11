(function ($) {
    var settings = {
        tabble: {}
    };
    $.fn.tabble = function () {
        this.html("<table class=\"tabble\"></table>");
        settings.tabble[this.selector] = {
            skip: {},
            currentCell: 0,
            currentRow: 0,
            cells: 0
        };
        var table = this.children(".tabble");
        if (arguments.length === 1 && typeof (arguments[0]) === "object") {
            this.putHead(arguments[0]);
        } else if (arguments.length === 2 && typeof (arguments[0]) === "object" && typeof (arguments[1]) === "object") {
            table.css(arguments[1]);
            this.putHead(arguments[0]);
        } else if (arguments.length === 2 && typeof (arguments[0]) === "object" && typeof (arguments[1]) === "string") {
            table.addClass(arguments[1]);
            this.putHead(arguments[0]);
        }
        return this;
    };
    $.fn.putHead = function () {
        if (arguments.length === 0) {
            return this;
        }
        var table = this.children(".tabble");
        if (typeof (arguments[0][0]) === "string") {
            var thead = "<thead><tr>";
            for (var i = 0; i < arguments[0].length; ++i) {
                thead += "<td>" + arguments[0][i] + "</td>";
            }
            settings.tabble[this.selector].cells = arguments[0].length;
            thead += "</tr></thead>";
            table.append(thead);
        } else if (typeof (arguments[0][0]) === "object") {
            var thead = "<thead><tr>";
            for (var i = 0; i < arguments[0].length; ++i) {
                var j = arguments[0][i];
                if (j.text) {
                    thead += "<td";
                    if (j.id) {
                        thead += " id=\"" + j.id + "\"";
                    }
                    if (j._class) {
                        thead += " class=\"" + j._class + "\"";
                    }
                    if (j.colspan) {
                        thead += " colspan=\"" + j.colspan + "\"";
                        settings.tabble[this.selector].cells += j.colspan - 1;
                    }
                    if (j.width) {
                        thead += " width=\"" + j.width + "\"";
                    }
                    thead += ">" + j.text + "</td>";
                    ++settings.tabble[this.selector].cells;
                }
            }
            thead += "</tr></thead>";
            table.append(thead);
        }
        return this;
    }
    $.fn.addCell = function () {
        if (arguments.length === 0) {
            return this;
        }
        var tbody = this.children(".tabble").children()[1];
        if (tbody === undefined) {
            this.children(".tabble").append("<tbody><tr></tr></tbody>");
            ++settings.tabble[this.selector].currentRow;
            ++settings.tabble[this.selector].currentCell;
            tbody = this.children(".tabble").children()[1];
        }
        var cellData = [];
        if (typeof (arguments[0]) === "string") {
            cellData.push({
                text: arguments[0]
            });
        } else if (typeof (arguments[0][0]) === "string") {
            for (var i = 0; i < arguments[0].length; ++i) {
                cellData.push({
                    text: arguments[0][i]
                });
            }
        } else if (typeof (arguments[0][0]) === "object") {
            for (var i = 0; i < arguments[0].length; ++i) {
                cellData.push(arguments[0][i]);
            }
        }
        var checkForSkip = function (T) {
            while ((settings.tabble[T.selector].skip !== undefined && settings.tabble[T.selector].skip["x" + settings.tabble[T.selector].currentCell] !== undefined && settings.tabble[T.selector].skip["x" + settings.tabble[T.selector].currentCell]["y" + settings.tabble[T.selector].currentRow] !== undefined) || (j.colspan && (settings.tabble[T.selector].currentCell + j.colspan - 1) > settings.tabble[T.selector].cells)) {
                ++settings.tabble[T.selector].currentCell;
                if (settings.tabble[T.selector].currentCell >= settings.tabble[T.selector].cells) {
                    ++settings.tabble[T.selector].currentRow;
                    settings.tabble[T.selector].currentCell = 1;
                    $(tbody).append("<tr></tr>");
                }
            }
        }
        for (var i = 0; i < cellData.length; ++i) {
            var j = cellData[i];
            checkForSkip(this);
            if (j.colspan || j.rowspan) {
                if (j.colspan && j.rowspan) {
                    for (var y = settings.tabble[this.selector].currentRow; y <= (settings.tabble[this.selector].currentRow + j.rowspan - 1); ++y) {
                        for (var x = settings.tabble[this.selector].currentCell; x <= (settings.tabble[this.selector].currentCell + j.colspan - 1); ++x) {
                            if (settings.tabble[this.selector].skip["x" + x] === undefined) {
                                settings.tabble[this.selector].skip["x" + x] = {};
                            }
                            settings.tabble[this.selector].skip["x" + x]["y" + y] = true;
                        }
                    }
                } else if (j.colspan) {
                    var tempY = settings.tabble[this.selector].currentRow;
                    if (settings.tabble[this.selector].currentCell + j.colspan - 1 > settings.tabble[this.selector].cells) {
                        ++tempY;
                    }
                    if (j.colspan > settings.tabble[this.selector].cells) {
                        j.colspan = settings.tabble[this.selector].cells;
                    }
                    for (var x = settings.tabble[this.selector].currentCell; x <= (settings.tabble[this.selector].currentCell + j.colspan - 1); ++x) {
                        if (settings.tabble[this.selector].skip["x" + x] === undefined) {
                            settings.tabble[this.selector].skip["x" + x] = {};
                        }
                        settings.tabble[this.selector].skip["x" + x]["y" + tempY] = true;
                    }
                } else if (j.rowspan) {
                    if (settings.tabble[this.selector].skip["x" + settings.tabble[this.selector].currentCell] === undefined) {
                        settings.tabble[this.selector].skip["x" + settings.tabble[this.selector].currentCell] = {};
                    }
                    for (var y = settings.tabble[this.selector].currentRow + 1; y <= (settings.tabble[this.selector].currentRow + (j.rowspan - 1)); ++y) {
                        settings.tabble[this.selector].skip["x" + settings.tabble[this.selector].currentCell]["y" + y] = true;
                    }
                }
            }
            var cell = "";
            if (settings.tabble[this.selector].currentCell > settings.tabble[this.selector].cells) {
                ++settings.tabble[this.selector].currentRow;
                settings.tabble[this.selector].currentCell = 1;
                checkForSkip(this);
                cell = "<tr><td";
                if (j.colspan) {
                    cell += " colspan=\"" + j.colspan + "\"";
                    settings.tabble[this.selector].currentCell += j.colspan - 1;
                }
                if (j.rowspan) {
                    cell += " rowspan=\"" + j.rowspan + "\"";
                }
                if (j.id) {
                    cell += " id=\"" + j.id + "\"";
                }
                if (j._class) {
                    cell += " class=\"" + j._class + "\"";
                }
                cell += ">" + j.text + "</td></tr>";
                $(tbody).append(cell);
            } else if (settings.tabble[this.selector].currentCell <= settings.tabble[this.selector].cells) {
                cell = "<td";
                if (j.colspan) {
                    cell += " colspan=\"" + j.colspan + "\"";
                    settings.tabble[this.selector].currentCell += j.colspan - 1;
                }
                if (j.rowspan) {
                    cell += " rowspan=\"" + j.rowspan + "\"";
                }
                if (j.id) {
                    cell += " id=\"" + j.id + "\"";
                }
                if (j._class) {
                    cell += " class=\"" + j._class + "\"";
                }
                cell += ">" + j.text + "</td>";
                $(($(tbody).children("tr")[settings.tabble[this.selector].currentRow - 1])).append(cell);
            }
            ++settings.tabble[this.selector].currentCell;
        }
    }
    $.fn.removeBody = function () {
        var temp = settings.tabble[this.selector].cells;
        settings.tabble[this.selector] = {
            skip: {},
            currentCell: 0,
            currentRow: 0,
            cells: temp
        };
        var tbody = this.children(".tabble").children()[1];
        if (tbody !== undefined) {
            $(tbody).remove("");
        }
        return this;
    }
}(jQuery));
