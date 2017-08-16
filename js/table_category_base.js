/**
 * Created by BrodyTravis on 4/23/2017.
 */

initialize_page();

function initialize_page() {
    var category_data = get_category_data();

    var adv_searches = 0;
    $('#content-title').html(category_data.name);


    $.get('ajax/index/' + category_data.name + '.php', {
        search_param: $('#search_param').val(),
        filter: $('#filter').val()
    }, function (response) {

        $('#category_content').css('background', "none").css('height', "auto");
        $('#content_panel').css('height', "auto");

        if (JSON.parse(response) === null) {
            $("#category_content").html("No results found!");
        } else {
            $('#category_content').html("<table id='category_table'></table>");
            $("#category_table").bootstrapTable({
                onClickRow: show_detail_modal,
                toolbar: '#category_toolbar_' + category_data.name,
                search: true,
                multipleSearch: true,
                showRefresh: (category_data.name === "licenses")? false: true,
                onRefresh: function(params){
                    $.get('ajax/index/category_handler.php', {category: category_data.name}, function (response) {
                        $('#content_frame').html($(response));
                    });
                },
                advancedSearch: true,
                idForm: 'category_advanced_search_' + category_data.name,
                idTable: 'category_advanced_table_' + category_data.name,
                pagination: true,
                pageSize: 25,
                data: JSON.parse(response),
                cache: true,
                flat: true,
                mobileResponsive: true,
                checkOnInit: true,
                columns: category_data.columns,
                sortName: category_data.sortName,
                sortOrder: 'desc',
                detailView: false,
                rowStyle: category_data.rowStyle,
                trimOnSearch: false
            });
        }
    });
}

/**
 *
 * @returns {{name: (*|jQuery), title: string, columns: *, sortName: string, rowStyle: rowStyle}}
 */
function get_category_data() {
    var category = $('#category').val();
    return {
        name: category,
        columns: get_column_data(category),
        sortName: (category === "licenses") ? 'Licence_Date' : 'lastsavedatetime',
        rowStyle: function (row, index) {
            if (category === "licenses") {
                if (new Date(row.Licence_Date) < new Date(new Date().getFullYear(), 0, 1)) {
                    return {
                        classes: 'bg-danger'
                    };
                } else {
                    return {
                        classes: 'bg-success'
                    };
                }
            }
            return {
                classes: ''
            };
        }
    };
}

/**
 *
 * @param row
 * @param element
 * @param field
 */
function show_detail_modal(row, element, field) {
    reset_modal();

    switch ($('#category').val()) {
        case "animals":
            build_detail_columns();
            build_animal_modal(row);
            break;
        case "people":
            build_detail_columns();
            build_people_modal(row);
            break;
        case "licenses":
            build_license_modal(row);
    }

    $('#more_info_modal').modal('show');
}


/**
 *
 * @param category
 * @returns {*}
 */
function get_column_data(category) {
    switch (category) {
        case "animals":
            return [{
                field: 'animalkey',
                title: '#',
                visible: false
            }, {
                field: 'petname',
                title: 'Name',
                sortable: true
            }, {
                field: 'breed1',
                title: 'Breed',
                sortable: true,
                formatter: nullformatter
            }, {
                field: 'name',
                title: 'Owner',
                sortable: true,
                formatter: nullformatter
            }, {
                field: 'lastsavedatetime',
                title: 'Latest Incident',
                sortable: true,
                formatter: dateformatter
            }];
            break;
        case "people":
            return [{
                field: 'personkey',
                title: '#',
                visible: false
            }, {
                field: 'fname',
                title: 'First Name',
                sortable: true,
                formatter: nullformatter
            }, {
                field: 'lname',
                title: 'Last Name',
                sortable: true,
                formatter: nullformatter
            }, {
                field: 'home_ph',
                title: 'Home Phone',
                sortable: true,
                formatter: telephoneFormatter
            }, {
                field: 'work_ph',
                title: 'Work Phone',
                sortable: true,
                formatter: telephoneFormatter
            }, {
                field: 'third_ph',
                title: 'Cell Phone',
                sortable: true,
                formatter: telephoneFormatter
            }, {
                field: 'email',
                title: 'Email',
                sortable: true,
                formatter: emailFormatter
            }, {
                field: 'lastsavedatetime',
                title: 'Date Added',
                sortable: true,
                formatter: dateformatter
            }];
            break;
        case "licenses":
            return [{
                field: 'Account_Num',
                title: '#',
                visible: false
            }, {
                field: 'Animal_Name',
                title: 'Pet Name',
                sortable: true
            }, {
                field: 'ClientName1',
                title: 'Owner Name',
                sortable: true,
                formatter: nullformatter
            }, {
                field: 'pet_breed_desc',
                title: 'Breed',
                sortable: true,
                formatter: nullformatter
            }, {
                field: 'Tag_Num',
                title: 'Tag #',
                sortable: true,
                formatter: tag_formatter
            }, {
                field: 'Licence_Date',
                title: 'License Date',
                sortable: true,
                formatter: dateformatter
            }, {
                field: 'address',
                title: 'Address',
                sortable: true,
                formatter: nullformatter
            }, {
                field: 'Phone1',
                title: 'Phone #',
                sortable: true,
                formatter: telephoneFormatter
            }]
            break;
    }
    return null;

}

function build_detail_columns() {
    $('#more_info_modal_body').append("<h3 class='text-center'><span class='label label-info'>Details</span></h3>" +
        "<div class='row' id='modal_detail_row_0'>" +
        "<div class='col-sm-6' id='modal_detail_column_0'></div>" +
        "<div class='col-sm-6' id='modal_detail_column_1'></div>" +
        "</div>" +
        "<div class='row' id='modal_detail_row_1'></div>");
}

function reset_modal() {
    $('#more_info_modal_body').empty();
    $('#modal_footer_content').empty();

}

//START FORMATTERS
/**
 *
 * @param value
 * @returns {*}
 */
function note_formatter(value) {
    value = nullformatter(value);
    if (value == "-") {
        return value;
    }
    return "<strong>" + value + "</strong>";
}

/**
 *
 * @param value
 * @returns {*}
 */
function currency_formatter(value) {
    value = nullformatter(value);
    if (value == "-") {
        value = 0;
    }
    return ("$" + "" + parseFloat(value).toFixed(2));
}

/**
 *
 * @param value
 * @returns {*}
 */
function dateformatter(value) {
    value = nullformatter(value);
    if (value == "-") {
        return value;
    }
    var sqlDateArr1 = value.split("-");
    var sYear = sqlDateArr1[0];
    var sMonth = (Number(sqlDateArr1[1]) - 1).toString();
    var sqlDateArr2 = sqlDateArr1[2].split(" ");
    var sDay = sqlDateArr2[0];
    var options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
    return new Date(sYear, sMonth, sDay).toLocaleString('en-US', options);
}

/**
 *
 * @param value
 * @returns {*}
 */
function emailFormatter(value) {
    value = nullformatter(value);
    if (value == "-") {
        return value;
    }
    return "<a href='mailto:" + value + "'>" + value + "</a>";
}

/**
 *
 * @param value
 * @returns {*}
 */
function telephoneFormatter(value) {
    value = nullformatter(value);
    if (value == "-" || value.length !== 10) {
        return value;
    }
    return "<a href='tel:" + value + "'>" + value.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3") + "</a>";
}

/**
 *
 * @param value
 * @returns {*}
 */
function nullformatter(value) {
    if ((typeof value !== 'undefined' || value !== null) && value) {
        value = value.trim();
        if ((value.length > 0 || value != "") && value != 0) {
            return value;
        }
    }
    return "-";
}

function tag_formatter(value){
    if(value.substr(0,4) === "9999"){
        return value.substr(4,value.length);
    }
    return value;
}

function fix_formatter(value){
    console.log(value)
    if(parseInt(value) === 0){
        return "NO";
    }
    return "YES";
}

/**
 *
 * @param detail
 * @param data
 * @returns {string}
 */
function format_detail(detail, data) {
    var center_text_class = "";
    if (detail === "email") {
        data = emailFormatter(data);
    } else if (detail === "home_ph" || detail === "work_ph" || detail === "third_ph") {
        switch(detail){
            case "home_ph":
                detail = "Home Phone";
                break;
            case "work_ph":
                detail = "Work Phone";
                break;
            case "third_ph":
                detail = "Cell Phone";
                break;
        }
        data = telephoneFormatter(data);
    } else if (detail === "lastsavedatetime") {
        detail = "Last Save";
        data = dateformatter(data);
    } else if (detail === "personkey") {
        detail = "#";
    } else if (detail === "Owner Name") {
        center_text_class = "text-center";

    } else if(detail === "fix"){
        detail = "FIXED";
        data = fix_formatter(data);
    }else if (detail === "Second Color" || detail === "crossbreed"){
        data = nullformatter(data);
        if(data === "-"){
            data = "NONE";
        }
    } else if(detail === "addeddatetime"){
        detail = "ADDED";
        data = dateformatter(data);
    }else {
        data = nullformatter(data);
    }

    return "<h4 class='text-left text-info " + center_text_class + "'><span class='label label-info text-uppercase'>" + detail + "</span>  <strong>" + data + "</strong></h4>";
}

//END FORMATTERS


//START ANIMAL MODAL

/**
 *
 * @param row
 */
function build_animal_modal(row) {
    $('#modal_footer_content').append("<hr/><h3 class='text-center'><span class='label label-warning'>Incidents</span></h3><div id='incidents_wrapper'></div>");


    $('#more_info_modal_title').text(row.petname);

    build_animal_details(row.animalkey);

    build_incidents_table(row.animalkey);

    $('#more_info_modal').modal('show');

}

/**
 *
 * @param element
 * @param row
 * @param $detail
 */
function incident_details_formatter(element, row, $detail) {
    $detail.append("<strong><div id='incident_details' class='text-warning text-center'></div></strong>");
    $detail.append("<div class='text-warning text-center'><div id='map_wrapper'></div><div id='notes_wrapper'></div></div>");

    $detail.find('#incident_details').html(row.details);

    $.get('ajax/index/details/notes.php', {incident_key: row.incidentkey}, function (response) {
        $detail.find('#notes_wrapper').prepend("<h3 class='text-center'><span class='label label-warning'>Notes</span></h3>");
        $detail.find('#notes_wrapper').append("<table></table>").find('table').bootstrapTable({
            columns: [{
                field: 'notedate',
                title: 'Date',
                sortable: true,
                formatter: dateformatter
            }, {
                field: 'notememo',
                title: 'Note',
                sortable: true,
                formatter: note_formatter
            }],
            data: JSON.parse(response),
            sortName: 'notedate',
            sortOrder: 'desc',
            mobileResponsive: true,
            checkOnInit: true,
            classes: 'table',
            search: true,
            rowStyle: function (row, index) {
                return {
                    classes: 'sub-table'

                }
            }
        });

    });

    $detail.find('#map_wrapper').prepend("<h3 class='text-center'><span class='label label-warning'>Map</span></h3>");
    $detail.find('#map_wrapper').append("<iframe class='embed-responsive-item' width='100%' height='300px' style='border:0' src='https://www.google.com/maps/embed/v1/place?key=AIzaSyBFlovsWHD7Hxw4jkqh4CVKMczHjyfCVCE&q=" + encodeURI(row.address) + "' allowfullscreen></iframe>");
}

/**
 *
 * @param animalkey
 */
function build_animal_details(animalkey) {
    $.get('ajax/index/details/animal_details.php', {animal_key: animalkey}, function (response) {
        var row = JSON.parse(response)[0];
        var $detail_col_0 = $('#modal_detail_column_0');
        var $detail_col_1 = $('#modal_detail_column_1');

        $detail_col_0.append(format_detail("Breed", row["Breed"]));
        $detail_col_0.append(format_detail("crossbreed", row["crossbreed"]));
        $detail_col_0.append(format_detail("aggressive", row["aggressive"]));
        $detail_col_0.append(format_detail("dangerous", row["dangerous"]));

        $detail_col_1.append(format_detail("Main Color", row["Main Color"]));
        $detail_col_1.append(format_detail("Second Color", row["Second Color"]));
        $detail_col_1.append(format_detail("fix", row["fix"]));
        $detail_col_1.append(format_detail("gender", row["gender"]));


        $('#modal_detail_row_1').append(format_detail("Owner Name", row["owner_name"]));
    });
}

/**
 *
 * @param animalkey
 */
function build_incidents_table(animalkey) {
    $.get('ajax/index/details/incidents.php', {animal_key: animalkey}, function (response) {
        if (JSON.parse(response) === null) {
            $('#incidents_wrapper').html("<p class='text-center text-warning'>No incidents found on record!</p>");
        } else {
            $('#incidents_wrapper').html("<table id='table_incidents'></table>");
            $('#table_incidents').bootstrapTable({
                columns: [{
                    field: 'datetimeassigned',
                    title: 'Date',
                    sortable: true,
                    formatter: dateformatter,
                    order: 'desc'
                }, {
                    field: 'address',
                    title: 'Address',
                    sortable: true
                }],
                data: JSON.parse(response),
                onClickRow: function (row, element) {
                    $(element[0]).find('.detail-icon').triggerHandler("click");
                },
                detailView: true,
                onExpandRow: incident_details_formatter,
                toolbar: '#toolbar_incidents',
                search: true,
                pagination: true,
                pageSize: 10,
                cache: true,
                sortName: 'datetimeassigned',
                sortOrder: 'desc'
            });
        }
    });
}
//END ANIMAL MODAL

//START PEOPLE MODAL
/**
 *
 * @param row
 */
function build_people_modal(row) {
    $('#modal_footer_content').append("<hr/><h3 class='text-center'><span class='label label-success'>Animals</span></h3>" +
        "<div id='dogs_wrapper'><p class='text-center text-success'>Loading Animals...</p></div>" +
        "<hr/><h3 class='text-center'><span class='label label-warning'>Charges</span></h3>" +
        "<div id='charges_wrapper'><p class='text-center text-warning'>Loading Charges...</p></div>");

    var fname = nullformatter(row.fname);
    var lname = nullformatter(row.lname);
    var modal_title = ((fname === "-") ? "" : fname + ", ") + lname;

    $('#more_info_modal_title').text(modal_title);

    build_people_details(row);

    build_dogs_table(row.personkey);

    build_charges_table(row.personkey);

}
/**
 *
 * @param person_key
 */
function build_dogs_table(person_key) {

    $.get('ajax/index/details/person_pets.php', {person_key: person_key}, function (response) {
        if (JSON.parse(response) === null) {
            $('#dogs_wrapper').html("<p class='text-center text-success'>No animals found on record!</p>");
        } else {
            $('#dogs_wrapper').html("<table id='table_dogs'></table>");
            $('#table_dogs').bootstrapTable({
                classes: 'table',
                columns: [{
                    field: 'petname',
                    title: 'Name',
                    sortable: true,
                    formatter: nullformatter
                }, {
                    field: 'breed',
                    title: 'Breed',
                    sortable: true,
                    formatter: nullformatter
                }, {
                    field: 'gender',
                    title: 'Gender',
                    sortable: true,
                    formatter: nullformatter
                }, {
                    field: 'lastsavedatetime',
                    title: 'Last Offense',
                    sortable: true,
                    formatter: dateformatter
                }],
                data: JSON.parse(response),
                toolbar: '#toolbar_dogs',
                search: true,
                searchText: '',
                pagination: true,
                pageSize: 10,
                cache: true,
                mobileResponsive: true,
                checkOnInit: true
            });
        }
    });
}

/**
 *
 * @param person_key
 */
function build_charges_table(person_key) {
    $('#charges_wrapper').html("Loading charges!");

    $.get('ajax/index/details/person_charges.php', {person_key: person_key}, function (response) {

        if (JSON.parse(response) == null) {
            $('#charges_wrapper').html("<p class='text-center text-warning'>No charges found on record!</p>");
        } else {
            $('#charges_wrapper').html("<table id='table_charges'></table>");
            $('#table_charges').bootstrapTable({
                classes: 'table',
                columns: [{
                    field: 'chargedate',
                    title: 'Date',
                    sortable: true,
                    formatter: dateformatter,
                    order: 'desc'
                }, {
                    field: 'Officer',
                    title: 'Issuer',
                    sortable: true,
                    formatter: nullformatter
                }, {
                    field: 'chargedesc',
                    title: 'Description',
                    sortable: true,
                    formatter: nullformatter
                }, {
                    field: 'chargeamount',
                    title: 'Charged',
                    sortable: true,
                    formatter: currency_formatter

                }, {
                    field: 'notememo',
                    title: 'Note',
                    sortable: true,
                    formatter: note_formatter
                }],
                data: JSON.parse(response),
                toolbar: '#toolbar_charges',
                search: true,
                pagination: true,
                pageSize: 10,
                cache: true,
                mobileResponsive: true,
                checkOnInit: true
            });
        }


    });
}

/**
 * 
 * @param row
 */
function build_people_details(row) {
    $('#modal_detail_column_0').append(format_detail("home_ph", row["home_ph"]));
    $('#modal_detail_column_0').append(format_detail("work_ph", row["work_ph"]));
    $('#modal_detail_column_0').append(format_detail("third_ph", row["third_ph"]));

    $('#modal_detail_column_1').append(format_detail("email", row["email"]));
    $('#modal_detail_column_1').append(format_detail("addeddatetime", row["addeddatetime"]));
    $('#modal_detail_column_1').append(format_detail("lastsavedatetime", row["lastsavedatetime"]));

}

//END PEOPLE MODAL

//START LICENSE MODAL
/**
 *
 * @param row
 */
function build_license_modal(row) {
    $('#more_info_modal_title').text("Map");
    $('#more_info_modal_body').append("<div id='map_wrapper'></div>");
    $('#map_wrapper').html("<iframe class='embed-responsive-item' width='100%' height='300px' style='border:0' src='https://www.google.com/maps/embed/v1/place?key=AIzaSyBFlovsWHD7Hxw4jkqh4CVKMczHjyfCVCE&q=" + encodeURI(row.address) + "' allowfullscreen></iframe>");
}
//END LICENSE MODAL