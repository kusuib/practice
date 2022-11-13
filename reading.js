//sound
var nowSound = "";
var audio = new Audio();
var a;
var sound_volume = 0.5;

//説明文中
var exp_now = false;

//再生Q番号
var play_q_num = 1;

//表示Qナンバー
var view_q_num = 1;

//問題音声
var q_sound = ['',
    './assets/mp3/E25201901A151001L02.mp3',
    './assets/mp3/E25201901A151002L02.mp3',
    './assets/mp3/E25201901A151003L02.mp3',
    './assets/mp3/E25201901A151004L02.mp3',
    './assets/mp3/E25201901A151005L02.mp3',
    './assets/mp3/E25201901A151006L02.mp3',
    './assets/mp3/E25201901A151007L02.mp3',
    './assets/mp3/E25201901A151008L02.mp3',
    './assets/mp3/E25201901A151009L02.mp3',
    './assets/mp3/E25201901A151010L02.mp3',
    './assets/mp3/E25201901A152011L01.mp3',
    './assets/mp3/E25201901A152012L01.mp3',
    './assets/mp3/E25201901A152013L01.mp3',
    './assets/mp3/E25201901A152014L01.mp3',
    './assets/mp3/E25201901A152015L01.mp3',
    './assets/mp3/E25201901A152016L01.mp3',
    './assets/mp3/E25201901A152017L01.mp3',
    './assets/mp3/E25201901A152018L01.mp3',
    './assets/mp3/E25201901A152019L01.mp3',
    './assets/mp3/E25201901A152020L01.mp3',
    './assets/mp3/E25201901A153021L03.mp3',
    './assets/mp3/E25201901A153022L03.mp3',
    './assets/mp3/E25201901A153023L03.mp3',
    './assets/mp3/E25201901A153024L03.mp3',
    './assets/mp3/E25201901A153025L03.mp3',
    './assets/mp3/E25201901A153026L03.mp3',
    './assets/mp3/E25201901A153027L03.mp3',
    './assets/mp3/E25201901A153028L03.mp3',
    './assets/mp3/E25201901A153029L03.mp3',
    './assets/mp3/E25201901A153030L03.mp3'
]


//説明音声
var exp_sound = ['',
    './assets/mp3/exp1.mp3',
    './assets/mp3/exp1.mp3',
    './assets/mp3/exp1.mp3'
]


//問題
//次の(1)から(20)までの(   )に入れるのに最も適切なものを 1, 2, 3, 4 の中から一つ選びなさい。
//次の四つの会話文を完成させるために, (21)から(25)に入るものとして最も適切なものを 1, 2, 3, 4 の中から一つ選びなさい。
//3-A 次の英文を読み, その文意にそって(26)から(27)までの(   )に入れるのに最も適切なものを 1, 2, 3, 4 の中から一つ選びなさい。
//3-B(28) 次の英文を読み, その文意にそって(28)から(30)までの(   )に入れるのに最も適切なものを 1, 2, 3, 4 の中から一つ選びなさい。
//4-A(31) 次の英文の内容に関して, (31)から(33)までの質問に対して最も適切なもの, または文を完成させるのに最も適切なものを 1, 2, 3, 4 の中から一つ選びなさい。
//4-B(34) 次の英文の内容に関して, (34)から(37)までの質問に対して最も適切なもの, または文を完成させるのに最も適切なものを 1, 2, 3, 4 の中から一つ選びなさい。

/*----------------------------------------------------------
    ローディング設定
----------------------------------------------------------*/
jQuery.event.add(window, "load", function() {

});


/*----------------------------------------------------------
    初期設定
----------------------------------------------------------*/
$(function() {

    const RATIO_BASE = 0.75;
    var height = $(window).height();
    var width = $(window).width();
    var ratio = height / width;

    if (ratio > RATIO_BASE) {
        $("#player").css("height", height + "px");
        $("#player").css("width", width + "px");
        scale = RATIO_BASE / ratio;
    } else {
        $("#player").css("height", height + "px");
        height = Math.floor(height * 4 / 3);
        $("#player").css("width", height + "px");
    }

    $('#entrance a').click(function(e) {
        e.preventDefault();
        FirstSet();
    });

    /*----------------------------------------------------------
      初期設定
    ----------------------------------------------------------*/
    function FirstSet() {
        $("#entrance").remove();

        //問題開始
        //StartQuestion(play_q_num);
        //StartExplain(1);

        //Q1設定
        $("#content_area").html("");
        $("#content_area").append($("#q" + view_q_num));
        $("#prev").hide();

        $(".answer_list_td").removeClass("view_question");
        $(".list_check_review").removeClass("view_question");
        $(".answer_button_list_td").removeClass("view_question");
        $(".q_list" + view_q_num + " .answer_list_td").addClass("view_question");
        $(".q_list" + view_q_num + " .list_check_review").addClass("view_question");
        $(".q_list" + view_q_num + " .answer_button_list_td").addClass("view_question");

        //タイマー開始
        var min = 25;
        var sec = 0;
        var view_min = ('00' + min).slice(-2);
        var view_sec = ('00' + sec).slice(-2);
        $("#remaining_time").text(view_min + ":" + view_sec);
        var timer1 = setInterval(function() {
            if (min == "") min = 0;
            min = parseInt(min);
            if (sec == "") sec = 0;
            sec = parseInt(sec);
            tmWrite(min * 60 + sec - 1);
            // console.log(sec)
        }, 1000);
        //残り時間を書き出す関数
        function tmWrite(int) {
            int = parseInt(int);
            if (int <= 0) {
                reSet();
                // alert("時間です！");
                $("#dialog_writing_end").hide();
                $("#modalWindow").show();
            } else {
                //残り分数はintを60で割って切り捨てる
                min = Math.floor(int / 60);
                //残り秒数はintを60で割った余り
                sec = int % 60;
                var view_min = ('00' + min).slice(-2);
                var view_sec = ('00' + sec).slice(-2);
                $("#remaining_time").text(view_min + ":" + view_sec);
            }
        }
        //フォームを初期状態に戻す（リセット）関数
        function reSet() {
            clearInterval(timer1);
        }


    }


    /*----------------------------------------------------------
      問題切り替え　ダイレクト
    ----------------------------------------------------------*/
    function Q_changeDirect(next_q, now_num) {
        console.log("問題切り替え next_q:" + next_q + " now_num:" + now_num);
        //ポップアップを閉じる
        $("#dialog_writing").dialog("close");
        if ($("#dialog_" + now_num).css("display") == 'block') {
            // 表示されている場合の処理
            $("#dialog_" + now_num).dialog("close");
        }

        //前後のボタン
        if (next_q == 1) {
            $("#prev").hide();
            $("#next").show();
            $("#last").hide();
        } else if (next_q == 27) {
            $("#next").hide();
            $("#prev").show();
            $("#last").show();
        } else {
            $("#prev").show();
            $("#next").show();
            $("#last").hide();
        }
        $("#screen_lock").show();

        //canvasコピー
        $("#canvas_list").append($(".canvas_base"));
        if (next_q >= 15 && next_q <= 16) {
            $("#q" + next_q + " #canvas_base").append($("#canvas_base01"));
        }
        if (next_q >= 17 && next_q <= 19) {
            $("#q" + next_q + " #canvas_base").append($("#canvas_base02"))
        }
        if (next_q >= 20 && next_q <= 22) {
            $("#q" + next_q + " #canvas_base").append($("#canvas_base03"))
        }
        if (next_q >= 23 && next_q <= 26) {
            $("#q" + next_q + " #canvas_base").append($("#canvas_base04"))
        }


        if (next_q > now_num) {
            //次の問題入れ込み

            $('.wr_contents_area').stop().animate({
                top: -$(".wr_contents_area").height()
            }, {
                duration: 600,
                easing: 'easeInOutQuad',
                complete: function() {
                    $("#screen_lock").hide();

                    //一覧に戻す
                    $("#ans_list").append($("#q" + now_num));
                    $("#content_area").append($("#q" + next_q));
                    view_q_num = next_q;
                    //次
                    $('.wr_contents_area').css("top", $(".wr_contents_area").height()).stop().animate({
                        top: 0
                    }, {
                        duration: 600,
                        easing: 'easeInOutQuad',
                        complete: function() {

                            //canvasサイズ調整
                            resize____Canvas($("#q" + view_q_num));


                            //リストの再生表示設定
                            $(".answer_list_td").removeClass("view_question");
                            $(".list_check_review").removeClass("view_question");
                            $(".answer_button_list_td").removeClass("view_question");
                            $(".q_list" + view_q_num + " .answer_list_td").addClass("view_question");
                            $(".q_list" + view_q_num + " .list_check_review").addClass("view_question");
                            $(".q_list" + view_q_num + " .answer_button_list_td").addClass("view_question");


                            //問題変更
                            if (view_q_num >= 1 && view_q_num < 11) {
                                $("#question_number_image").attr("src", "./assets/img/010_1.png");
                                $("#question_explanation span").text("次の(1)から(20)までの(   )に入れるのに最も適切なものを 1, 2, 3, 4 の中から一つ選びなさい。");
                            } else if (view_q_num >= 11 && view_q_num < 15) {
                                $("#question_number_image").attr("src", "./assets/img/020_1.png");
                                $("#question_explanation span").text("次の四つの会話文を完成させるために, (21)から(25)に入るものとして最も適切なものを 1, 2, 3, 4 の中から一つ選びなさい。");
                            } else if (view_q_num >= 15 && view_q_num < 17) {
                                $("#question_number_image").attr("src", "./assets/img/031_1.png");
                                $("#question_explanation span").text("次の英文を読み, その文意にそって(26)から(27)までの(   )に入れるのに最も適切なものを 1, 2, 3, 4 の中から一つ選びなさい。");
                            } else if (view_q_num >= 17 && view_q_num < 20) {
                                $("#question_number_image").attr("src", "./assets/img/032_1.png");
                                $("#question_explanation span").text("次の英文を読み, その文意にそって(28)から(30)までの(   )に入れるのに最も適切なものを 1, 2, 3, 4 の中から一つ選びなさい。");
                            } else if (view_q_num >= 20 && view_q_num < 23) {
                                $("#question_number_image").attr("src", "./assets/img/041_1.png");
                                $("#question_explanation span").text("次の英文の内容に関して, (31)から(33)までの質問に対して最も適切なもの, または文を完成させるのに最も適切なものを 1, 2, 3, 4 の中から一つ選びなさい。");
                            } else if (view_q_num >= 23 && view_q_num < 27) {
                                $("#question_number_image").attr("src", "./assets/img/042_1.png");
                                $("#question_explanation span").text("次の英文の内容に関して, (34)から(37)までの質問に対して最も適切なもの, または文を完成させるのに最も適切なものを 1, 2, 3, 4 の中から一つ選びなさい。");
                            } else if (view_q_num >= 27) {}
                            if (view_q_num >= 27) {
                                $("#question_area").hide();
                            } else {
                                $("#question_area").show();
                            }
                        }
                    });
                }
            });
        } else {
            //次の問題入れ込み
            $('.wr_contents_area').stop().animate({
                top: -$(".wr_contents_area").height()
            }, {
                duration: 800,
                easing: 'easeInOutQuad',
                complete: function() {
                    $("#screen_lock").hide();

                    //一覧に戻す
                    $("#ans_list").append($("#q" + now_num));
                    $("#content_area").prepend($("#q" + next_q));
                    view_q_num = next_q;
                    $('.wr_contents_area').css("top", $(".wr_contents_area").height()).stop().animate({
                        top: 0
                    }, {
                        duration: 600,
                        easing: 'easeInOutQuad',
                        complete: function() {

                            //canvasサイズ調整
                            resize____Canvas($("#q" + view_q_num));


                            //リストの再生表示設定
                            $(".answer_list_td").removeClass("view_question");
                            $(".list_check_review").removeClass("view_question");
                            $(".answer_button_list_td").removeClass("view_question");
                            $(".q_list" + view_q_num + " .answer_list_td").addClass("view_question");
                            $(".q_list" + view_q_num + " .list_check_review").addClass("view_question");
                            $(".q_list" + view_q_num + " .answer_button_list_td").addClass("view_question");

                            //問題変更
                            if (view_q_num >= 1 && view_q_num < 11) {
                                $("#question_number_image").attr("src", "./assets/img/010_1.png");
                                $("#question_explanation span").text("次の(1)から(20)までの(   )に入れるのに最も適切なものを 1, 2, 3, 4 の中から一つ選びなさい。");
                            } else if (view_q_num >= 11 && view_q_num < 15) {
                                $("#question_number_image").attr("src", "./assets/img/020_1.png");
                                $("#question_explanation span").text("次の四つの会話文を完成させるために, (21)から(25)に入るものとして最も適切なものを 1, 2, 3, 4 の中から一つ選びなさい。");
                            } else if (view_q_num >= 15 && view_q_num < 17) {
                                $("#question_number_image").attr("src", "./assets/img/031_1.png");
                                $("#question_explanation span").text("次の英文を読み, その文意にそって(26)から(27)までの(   )に入れるのに最も適切なものを 1, 2, 3, 4 の中から一つ選びなさい。");
                            } else if (view_q_num >= 17 && view_q_num < 20) {
                                $("#question_number_image").attr("src", "./assets/img/032_1.png");
                                $("#question_explanation span").text("次の英文を読み, その文意にそって(28)から(30)までの(   )に入れるのに最も適切なものを 1, 2, 3, 4 の中から一つ選びなさい。");
                            } else if (view_q_num >= 20 && view_q_num < 23) {
                                $("#question_number_image").attr("src", "./assets/img/041_1.png");
                                $("#question_explanation span").text("次の英文の内容に関して, (31)から(33)までの質問に対して最も適切なもの, または文を完成させるのに最も適切なものを 1, 2, 3, 4 の中から一つ選びなさい。");
                            } else if (view_q_num >= 23 && view_q_num < 27) {
                                $("#question_number_image").attr("src", "./assets/img/042_1.png");
                                $("#question_explanation span").text("次の英文の内容に関して, (34)から(37)までの質問に対して最も適切なもの, または文を完成させるのに最も適切なものを 1, 2, 3, 4 の中から一つ選びなさい。");
                            } else if (view_q_num >= 27) {}
                            if (view_q_num >= 27) {
                                $("#question_area").hide();
                            } else {
                                $("#question_area").show();
                            }
                        }
                    });
                }
            });

        }
    }

    function resize____Canvas(target) {


        // 赤ペンボタンのボーダー色・背景を変更
        $("#pen").css({ "border-color": "#E0C88F", "background-color": "#E5E5E5" });
        $("#marker").css({ "border-color": "#B3B3B3", "background-color": "#F3F3F3" });
        $("#eraser").css({ "border-color": "#B3B3B3", "background-color": "#F3F3F3" });
        // キャンバスの描画状態設定
        drawType = CRAW_TYPE_SOURCE_OVER;
        drawColor = DRAW_COLOR_RED;
        drawSize = DRAW_SIZE_SMALL;
        // キャンバス上のマウスカーソルを「ペン」に設定
        $("#canvas").addClass("pen");
        $("#canvas").removeClass("marker");
        $("#canvas").removeClass("eraser");


        if (!target.find("canvas").hasClass("set_canvas_size")) {
            target.find("canvas").addClass("set_canvas_size")
            var now_height = target.find("#canvas_background").height();
            // console.log(now_height);
            target.find("canvas").height(target.find("#canvas_background").height());
            target.find("canvas").attr("height", target.find("#canvas_background").height());


            setTimeout(function() {
                target.find("canvas").height(target.find("#canvas_background").height());
                target.find("canvas").attr("height", target.find("#canvas_background").height());

                target.find("#canvas_background").height(target.find("canvas").height() - 30);
            }, 200);

            var now_width = target.find("canvas").width();
            target.find("canvas").width(target.find("#canvas_background").width());
            target.find("canvas").attr("width", target.find("#canvas_background").width());

        }
    }

    /*----------------------------------------------------------
      前・次の問題へ
    ----------------------------------------------------------*/
    $('#next').click(function(e) {
        e.preventDefault();
        var next_q = view_q_num + 1;
        Q_changeDirect(next_q, view_q_num);
    });
    $('#prev').click(function(e) {
        e.preventDefault();
        var next_q = view_q_num - 1;
        Q_changeDirect(next_q, view_q_num);
    });

    /*----------------------------------------------------------
      リストから問題へ
    ----------------------------------------------------------*/
    $('.direct_item').click(function(e) {
        e.preventDefault();
        var next_q = parseInt($(this).attr("set_q"));
        Q_changeDirect(next_q, view_q_num);
    });

    /*----------------------------------------------------------
      解答クリック
    ----------------------------------------------------------*/
    $('.answer_button').click(function(e) {
        e.preventDefault();
        var target = $(this).attr("qno");
        var ans = $(this).attr("ano");

        if ($(this).hasClass("button_click")) {
            $(this).removeClass("button_click");
            $(".answer_button_list_td[qno='" + target + "']").find(".answer_button_list").removeClass("button_click");
        } else {
            $(this).parent().parent().parent().find(".answer_button").removeClass("button_click");
            $(this).addClass("button_click");
            $(".answer_button_list_td[qno='" + target + "']").find(".answer_button_list").removeClass("button_click");
            $(".answer_button_list_td[qno='" + target + "']").find(".answer_button_list[ano='" + ans + "']").addClass("button_click");
        }
    });
    $('.answer_button_list').click(function(e) {
        e.preventDefault();
        var target = $(this).parent().attr("qno");
        var ans = $(this).attr("ano");

        if ($(this).hasClass("button_click")) {
            $(this).removeClass("button_click");
            $(".answer_button[qno='" + target + "']").removeClass("button_click");
        } else {
            $(this).parent().find(".answer_button_list").removeClass("button_click");
            $(this).addClass("button_click");
            $(".answer_button[qno='" + target + "']").removeClass("button_click");
            $(".answer_button[qno='" + target + "'][ano='" + ans + "']").addClass("button_click");
        }
    });


    /*----------------------------------------------------------
      目印クリック
    ----------------------------------------------------------*/
    $('.answer_check_review').click(function(e) {
        var target = $(this).attr("sno");
        if ($(this).prop("checked") == true) {
            $(".check_review[sno='" + target + "']").prop("checked", true);
        } else {
            $(".check_review[sno='" + target + "']").prop("checked", false);
        }
    });
    $('.check_review').click(function(e) {
        var target = parseInt($(this).attr("sno"));
        if ($(this).prop("checked") == true) {
            $("#check_" + target).prop("checked", true);
        } else {
            $("#check_" + target).prop("checked", false);
        }
    });

    /*----------------------------------------------------------
      終了
    ----------------------------------------------------------*/
    $('#reding_writing_end, #last').click(function(e) {
        // $("#container").hide();
        $("#dialog_writing_end").show();
    });
    $('#dialog_writing_end_cancel').click(function(e) {
        // $("#container").hide();
        $("#dialog_writing_end").hide();
    });
    $('#dialog_writing_end_ok').click(function(e) {
        // $("#container").hide();
        $("#dialog_writing_end").hide();
        $("#modalWindow").show();
    });
    $('#all_end').click(function(e) {
        // $("#container").hide();
        // location.href="./"
        window.close();
    });



    /*----------------------------------------------------------
      ライティング解答領域・入力
    ----------------------------------------------------------*/
    $(document).on("input", "#writing", function() {
        let str = $(this).val();
        if (str.length > 3000) {
            str = str.slice(0, 3000);
        }
        str = str.replace(/[^a-zA-Z0-9 \!\-\r\n\^\\\.,;:_~()'"@<>?{}\[\]=]/g, "");

        $("#writing").val(str);

        // 単語数算出
        //let count = countWords($(this).val());
        let count = countWords(str);
        if (str.trim() == "") {
            count = 0;
        }
        // 単語数表示
        $("#word_count").html(count);
        // 単語数が０より大きいとき
        if (count > 0) {
            $(".answer_writing").html("解答あり");
        } else {
            $(".answer_writing").html("未解答");
        }
    });
    // 単語数検索
    function countWords(text) {
        return (text += ".").trim().replace(/(\,|\.|:|;|\!|\?|\s)+/g, " ").split(" ").length - 1;
    }

    /*----------------------------------------------------------
      コピー
    ----------------------------------------------------------*/
    var write_paste = false;
    $('#w_copy').click(function(e) {
        // $("#clip").val(document.getElementById("writing").value);
        $("#clip").val($("#writing").selection());
    });
    $(document).on("click", "#w_paste", function() {
        if ($("#clip").val() != "") {
            if ($("#writing").selection() != "") {
                // 貼り付け確認ダイアログを開く
                $("#paste_dialog").show();
                // $("#dialog_writing_alert").dialog("open");

                // いいえボタンにフォーカス
                //$("#dialog_writing_alert_cancel").focus();
            } else {
                /* 2020/07/24 文字数上限で貼り付けを行った場合の警告文対応*/
                // 貼り付け後の文字数が3000文字以内の場合は貼り付け可
                if ($("#clip").val().length + $("#writing").val().length < 3000) {

                    /* 2020/05/26 貼り付け後カーソルの位置を最後に移動する対応*/
                    $("#writing").selection("replace", { text: $("#clip").val(), caret: 'end' });
                    /* 2020/05/26 貼り付け後カーソルの位置を最後に移動する対応*/

                    // 単語数算出
                    let count = countWords($("#writing").val());
                    if ($("#writing").val().trim() == "") {
                        count = 0;
                    }
                    // 単語数表示
                    $("#word_count").html(count);

                } else {
                    // 文字数上限を超えて貼り付けを行う場合、警告ダイアログを表示
                    $("#dialog_writing_paste").html("文字数が3000文字を超えています。<br> コピーする文字列を調整してください。");
                    // 貼り付け警告ダイアログ表示
                    $("#dialog_writing_paste").dialog("open");
                    // テキスト表示位置の調整
                    $(".ui-dialog .ui-dialog-content").css({ "padding": "3vh 2.5vh", "text-align": "center" });
                }
            }
        }
    });

    $("#dialog_writing_alert_ok").click(function(e) {
        // write_paste=true;
        $("#paste_dialog").hide();
        $("#writing").selection("replace", { text: $("#clip").val(), caret: 'end' });
        //document.getElementById('writing').value = $("#clip").val();


        // 単語数算出
        let count = countWords($("#writing").val());
        if ($("#writing").val().trim() == "") {
            count = 0;
        }
        // 単語数表示
        $("#word_count").html(count);
    });

    $("#dialog_writing_alert_cancel").click(function(e) {
        write_paste = false;
        $("#paste_dialog").hide();
    });


    $("#dialog-link_writing").click(function(e) {
        $("#dialog_writing").html(escapeHTML($("#writing").val()).replace(/\r?\n/g, '<br />'));
        $("#dialog_writing").dialog("open");
        $(".ui-dialog-titlebar-close").css("display", "block");
        $(".ui-dialog .ui-dialog-content").css({ "padding": "0", "text-align": "left" });
    });

    //ダイアログ生成
    $("#dialog_writing").dialog({
        autoOpen: false,
        width: $("#content_area").width() * 0.9,
        height: $("#content_area").height() * 0.9,
        resizable: true,
        close: function() {
            $(".ui-dialog-titlebar-close").css("display", "none");
        }
    });
    $('#dialog_writing_paste').dialog({
        dialogClass: 'titleClass',
        autoOpen: false,
        width: $("#content_area").width() * 0.4,
        height: $("#content_area").height() * 0.3,
        modal: true,
        draggable: false,
        title: "ライティング",
        resizable: false,
        buttons: {
            "OK": function() {
                $(this).dialog("close");
            }
        },
    });

    function escapeHTML(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    };


    /*----------------------------------------------------------
      問題開閉
    ----------------------------------------------------------*/
    $('#arrow_img_area').click(function(e) {
        e.preventDefault();
        if ($(this).hasClass("view")) {
            $(this).removeClass("view");
            $(this).find(".icon-down").show();
            $(this).find(".icon-up").hide();
            $("#question_number_image_area").hide();
            $('.question_slide').stop().animate({
                height: "3.5vh"
            }, {
                duration: 300,
                easing: 'easeInOutQuad',
                complete: function() {}
            });
        } else {
            $(this).addClass("view");
            $(this).find(".icon-down").hide();
            $(this).find(".icon-up").show();
            $('.question_slide').stop().animate({
                height: "10vh"
            }, {
                duration: 300,
                easing: 'easeInOutQuad',
                complete: function() {
                    $("#question_number_image_area").show();
                }
            });
        }
    });
    $('#answer_arrow_img_area').click(function(e) {
        e.preventDefault();
        if ($(this).hasClass("view")) {
            $(this).removeClass("view");
            $(this).find(".icon-left").show();
            $(this).find(".icon-right").hide();
            $("#answer_panle").hide();
            $(".answer_area_title").hide();

            $('#answer_area').stop().animate({
                width: "3vh"
            }, {
                duration: 300,
                easing: 'easeInOutQuad',
                complete: function() {}
            });
        } else {
            $(this).addClass("view");
            $(this).find(".icon-left").hide();
            $(this).find(".icon-right").show();
            $('#answer_area').stop().animate({
                width: "41.5vh"
            }, {
                duration: 300,
                easing: 'easeInOutQuad',
                complete: function() {
                    $("#answer_panle").show();
                    $(".answer_area_title").show();
                }
            });
        }
    });
});


(function() {
    /*----------------------------------------------------------
      scroll
    ----------------------------------------------------------*/
    function scroll_resize() {
        WinScroll = $(window).scrollTop();
        WinW = $(window).width();
        WinH = window.innerHeight ? window.innerHeight : $(window).height();

    }

    $(window).on('load', scroll_resize);
    $(window).on('orientationchange load scroll resize', scroll_resize);
})();