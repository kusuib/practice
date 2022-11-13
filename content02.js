"use strict";

// 長文キャンバス描画情報
// 線の色
/* 2020/07/07 ペンの色透過度設定変更 */
//const DRAW_COLOR_RED						= "rgba(255 ,0, 0, 1)";			// 赤（不透明）
const DRAW_COLOR_RED						= "rgba(255 ,75, 0, 0.5)";		// 赤（不透明度：５０％）
/* 2020/07/07 ペンの色透過度設定変更 */
const DRAW_COLOR_YELLOW						= "rgba(255, 255, 0, 0.3)";		// 黄色（不透明度：３０％）
/* 2020/07/10 消しゴムの透過度設定*/
const DRAW_COLOR_LESS						= "rgba(255 ,0, 0, 1)";			// 赤（不透明）
/* 2020/07/10 消しゴムの透過度設定*/

// 線の太さ
const DRAW_SIZE_SMALL						= 4;							// 細いペンの線
const DRAW_SIZE_MIDDLE						= 20;							// マーカー線
const DRAW_SIZE_LARGE						= 25;							// 太めのマーカー線
// 線の種類
const CRAW_TYPE_SOURCE_OVER					= "source-over";				// 描画先に描画元を上書き
const CRAW_TYPE_DESTINATION_OUT				= "destination-out";			// 描画元を透過して描画先を使用


// 解答情報変数
let writeingAnswer = "";											// ライティング解答
let writeListen = "";												// 筆記・リスニング区分
let canvasData = [];												// 長文画像キャンバスデータ配列
let draw = false;													// 描画フラグ
let drawColor = DRAW_COLOR_RED;										// 線の色
let drawSize = DRAW_SIZE_SMALL;										// 線の太さ
let drawType = CRAW_TYPE_SOURCE_OVER;								// 線の種類
let answerData = [];												// 選択された解答情報
let reviewData = [];												// 見直し情報
let answerList;														// 解答済み情報
let writingEndFlg = false;											// ライティング終了ボタン回数フラグ

let leftClick = false;	
$(function(){
	// 変数初期化
	let mouseX1, mouseY1;
	
	// キャンバス・マウスダウン
	$(document).on("mousedown","#canvas",function(eo){
		// 描画開始位置設定
		if(eo.which == 1){
			draw = true;
/* 2020/07/19  キャンパス外から戻ったときにペンを有効にする対応*/				
			leftClick = true;
/* 2020/07/19  キャンパス外から戻ったときにペンを有効にする対応*/				
			mouseX1 = eo.pageX - $("#canvas").offset().left;
			mouseY1 = eo.pageY - $("#canvas").offset().top;
		}
	});
	
	// キャンバス・マウスアップ
	$(document).on("mouseup","#canvas",function(eo){
		// 描画フラグに未描画を設定
		draw = false;
	});
	
	// キャンバス・マウスムーブ
	$(document).on("mousemove","#canvas",function(eo){
		// 描画中のとき
		if(draw){
			// 現在の描画位置を取得
			let endX = eo.pageX - $("#canvas").offset().left;
			let endY = eo.pageY - $("#canvas").offset().top;
			// キャンバスに洋画
			$("#canvas").drawPath({
				strokeStyle: drawColor,			// 色
				strokeWidth: drawSize,			// 太さ
				compositing: drawType,			// 種別
				p1: {
					type: 'line',				// 直線
					x1: mouseX1, y1: mouseY1,	// 描画開始位置
					x2: endX, y2: endY			// 描画終了位置
				}
			});
			// 描画開始位置に現在の描画位置を設定
			mouseX1 = endX;
			mouseY1 = endY;
		}
	});
	
	// キャンバス・マウス離脱
	$(document).on("mouseleave","#canvas",function(eo){
		// 描画フラグに未描画を設定
		draw = false;
	});
	
/* 2020/07/19 キャンパスにマウスがある場合に描画を可能とする対応*/
	// キャンパス・マウスオーバー
	$(document).on("mouseover","#canvas",function(eo){
		
/* 2020/07/19  キャンパス外から戻ったときにペンを有効にする対応*/				
		if(leftClick){
			// 描画フラグに描画を設定
			draw = true;
		} 
/* 2020/07/19  キャンパス外から戻ったときにペンを有効にする対応*/		
	});
/* 2020/07/19 キャンパスにマウスがある場合に描画を可能とする対応*/	

	// 長文・マウスアップ
	$(document).on("mouseup","body",function(eo){
		// 左クリックフラグに未押下を設定
		leftClick = false;
	});	

	// 赤ペンボタンクリック
	$(document).on("click", "#pen", function(eo){
		// 赤ペンボタンのボーダー色・背景を変更
		$(this).css({"border-color":"#E0C88F","background-color":"#E5E5E5"});
		$("#marker").css({"border-color":"#B3B3B3","background-color":"#F3F3F3"});
		$("#eraser").css({"border-color":"#B3B3B3","background-color":"#F3F3F3"});
		// キャンバスの描画状態設定
		drawType = CRAW_TYPE_SOURCE_OVER;
		drawColor = DRAW_COLOR_RED;
		drawSize = DRAW_SIZE_SMALL;
		// キャンバス上のマウスカーソルを「ペン」に設定
		$("#canvas").addClass("pen");
		$("#canvas").removeClass("marker");
		$("#canvas").removeClass("eraser");
	});
	// マーカーボタンクリック
	$(document).on("click", "#marker", function(eo){
		// マーカーボタンのボーダー色・背景を変更
		$(this).css({"border-color":"#E0C88F","background-color":"#E5E5E5"});
		$("#pen").css({"border-color":"#B3B3B3","background-color":"#F3F3F3"});
		$("#eraser").css({"border-color":"#B3B3B3","background-color":"#F3F3F3"});
		// キャンバスの描画状態設定
		drawType = CRAW_TYPE_SOURCE_OVER;
		drawColor = DRAW_COLOR_YELLOW;
		drawSize = DRAW_SIZE_MIDDLE;
		// キャンバス上のマウスカーソルを「マーカー」に設定
		$("#canvas").removeClass("pen");
		$("#canvas").addClass("marker");
		$("#canvas").removeClass("eraser");
	});
	// 消しゴムボタンクリック
	$(document).on("click", "#eraser", function(eo){
		// 消しゴムボタンのボーダー色・背景を変更
		$(this).css({"border-color":"#E0C88F","background-color":"#E5E5E5"});
		$("#marker").css({"border-color":"#B3B3B3","background-color":"#F3F3F3"});
		$("#pen").css({"border-color":"#B3B3B3","background-color":"#F3F3F3"});
		// キャンバスの描画状態設定
		drawType = CRAW_TYPE_DESTINATION_OUT;
/* 2020/07/10 消しゴムの透過度設定*/
//		drawColor = DRAW_COLOR_RED;
		drawColor = DRAW_COLOR_LESS;
/* 2020/07/10 消しゴムの透過度設定*/
		drawSize = DRAW_SIZE_LARGE;
		// キャンバス上のマウスカーソルを「消しゴム」に設定
		$("#canvas").removeClass("pen");
		$("#canvas").removeClass("marker");
		$("#canvas").addClass("eraser");
	});
	
	// 全画面表示ボタンクリック
	$(document).on("click", "#view_sentence", function(){
		// alert(view_q_num)
		// 設問番号取得
		// let q_no = parseInt(formationData[currentFomationNo]["examItems"][currentItemNo]["questions"]["1"]["examSetNo"]);
		
		// 設問番号にあったダイアログを表示
		// $("#dialog_" + q_no).dialog("open");
		$("#dialog_" + view_q_num).dialog({
			autoOpen: false,
			width: $("#canvas_base").width()*1.1,
			height: $("#canvas_base").height()*1.1,
			resizable: true,
			close: function() {
				$(".ui-dialog-titlebar-close").css("display","none");
			}
		});
		$("#dialog_" + view_q_num).dialog("open");
		
		/* 2020/07/23 全画面表示を画像の長い方に合わせる対応*/		
		let img_h = $("#dialog_" + view_q_num).find(".other_dialog").height();
		let img_w = $("#dialog_" + view_q_num).find(".other_dialog").width();
		
		if(img_h <= img_w){
			$("#dialog_" + view_q_num).find(".other_dialog").css("width","100%");
		}else{
			$("#dialog_" + view_q_num).find(".other_dialog").css("height","100%");
		}
		/* 2020/07/23 全画面表示を画像の長い方に合わせる対応*/

		// 閉じるボタン再表示
		$(".ui-dialog-titlebar-close").css("display","block");
		// イベントキャンセル
		event.preventDefault();
	});

	// ウインドウ・リサイズ
	$(window).resize(function(){
		// キャンバンスの状態をウインドウサイズに合わせる
		resizeCanvas();
	});
	
	// $(".long_sentence_btn_select").tooltip({
	// 	show:false,
	// 	hide:false
	// });
	
	// $("#marker").tooltip({
	// 	show:false,
	// 	hide:false
	// });
	
	// $("#eraser").tooltip({
	// 	show:false,
	// 	hide:false
	// });
	
	// $("#view_sentence").tooltip({
	// 	show:false,
	// 	hide:false
	// });
});

// キャンバスリサイズ
function resizeCanvas(){
	if($("#canvas").length){
		// // alert()
		// let ctx = $("#canvas").get(0).getContext('2d');
		// let w = $("#canvas").attr("width");
		// let h = $("#canvas").attr("height");
		// // let class_name = formationData[currentFomationNo]["examClass"];
		// let class_name = "pen";
		
		// if (typeof w === "undefined") {
		// 	w = $("#canvas").width();
		// }
		// if (typeof h === "undefined") {
		// 	h = $("#canvas").height();
		// }
		
		// canvasData[class_name] = ctx.getImageData(0, 0, w, h);
		
		// $("#canvas").attr("width", $("#canvas").width());
		// $("#canvas").attr("height", $("#canvas").height());
		
		// ctx.putImageData(canvasData[class_name], 0, 0);
		// canvasData[class_name] = null;
	}
}

// コンテンツ初期化
function createContent02(f_no, q_no){
	// 変数宣言
	let lmage_origin = $("#canvas_background").src;
	let ans, review;
	let class_name;
	
	// 選択結果を設定
	ans = $(".answer_button_list_td[qno='" + q_no + "'] .button_click").attr("ano");
	review = $("#list_check_" + q_no).prop("checked");
	if(ans){
		$(".exam_select .answer_button[qno='" + q_no + "'][ano='" + ans + "']").addClass("button_click");
	}
	// 見直しチェックボックスを設定
	$("#check_" + q_no).prop("checked", review);
	
	// ボタンアイコン設定
	$("#pen_img").attr("src", contentsServer + "img/writing/pen.png"); 		// 赤ペン
	$("#marker_img").attr("src", contentsServer + "img/writing/marker.png");	// マーカー
	$("#eraser_img").attr("src", contentsServer + "img/writing/eraser.png");	// 消しゴム
	
	// キャンバスの設定
	$("#canvas").addClass("pen");
	$("#canvas").removeClass("marker");
	$("#canvas").removeClass("eraser");
	drawType = CRAW_TYPE_SOURCE_OVER;
	drawColor = DRAW_COLOR_RED;
	drawSize = DRAW_SIZE_SMALL;
	
	// 長文表示ダイアログ設定
	//$("#dialog_" + q_no).dialog({
		//alert(view_q_num)
	$("#dialog_" + view_q_num).dialog({
		autoOpen: false,
/* 2020/07/23 全画面表示を画像の長い方に合わせる対応*/
		width: $("#canvas_base").width()*1.1,
//		width: $("#canvas_base").width(),
/* 2020/07/23 全画面表示を画像の長い方に合わせる対応*/
		height: $("#canvas_base").height()*1.1,

/* 2019/12/11 ダイアログのリサイズ時に表示崩れが発生する不具合対応*/
		resizable: true,
/* 2019/12/11 ダイアログのリサイズ時に表示崩れが発生する不具合対応*/

		close: function() {
			// 閉じるボタン無効化
			$(".ui-dialog-titlebar-close").css("display","none");
		}
	});
	
/*
	// 長文画像の大きさに合わせて高さを調整
	$("#canvas_background").height($("#canvas_background").height() - 30);
	$("#canvas").height($("#canvas_background").height() + 30);
	
	// キャンバスの描画領域設定
	$("#canvas").attr("width", $("#canvas").width());
	$("#canvas").attr("height", $("#canvas").height());
	
	class_name = formationData[f_no]["examClass"];
	
	if(canvasData[class_name]){
		let ctx = $("#canvas").get(0).getContext('2d');
		ctx.putImageData(canvasData[class_name], 0, 0);
		canvasData[class_name] = null;
	}
*/	
	// 画像の読み込み終了時にサイズ変更
	$("#canvas_background").src = "";
	$("#canvas_background").on("load", function(){
		// 長文画像の大きさに合わせて高さを調整
		$("#canvas_background").height($("#canvas_background").height() - 30);
		$("#canvas").height($("#canvas_background").height() + 30);
		
		// キャンバスの描画領域設定
		$("#canvas").attr("width", $("#canvas").width());
		$("#canvas").attr("height", $("#canvas").height());
		
		class_name = formationData[f_no]["examClass"];
		
		if(canvasData[class_name]){
			let ctx = $("#canvas").get(0).getContext('2d');
			ctx.putImageData(canvasData[class_name], 0, 0);
			canvasData[class_name] = null;
		}
	});
	$("#canvas_background").src = lmage_origin;
}
