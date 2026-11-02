/* =========================================================
 * shared/smooth-fonts.js — Windows で日本語の Web フォントがガタガタになるのを直す
 *  Google Fonts は Windows にだけ「ヒンティング付き」の別ファイルを配る。
 *  日本語の書体（M PLUS Rounded 1c など）はこのヒンティングで線が画素に吸い付き、
 *  太さがそろわずガタガタに見える。iPhone・Android には「ヒンティングなし」のファイルが届き、滑らか。
 *  そこで Windows のときだけ、読み込んだ Google Fonts の CSS を取り直し、日本語の書体だけ
 *  iPhone・Android と同じファイルを指す @font-face を後ろに足す（同じ書体名・太さなら後ろが勝つ）。
 *    ・Windows 以外では何もしない（iPhone・Android は今までどおり）
 *    ・Google Fonts が書体を新しい版にすると MAP に当たらなくなり、何もしない（今までの見た目に戻るだけ）
 *      → python tools/smooth-fonts-gen.py の出力で MAP を作り直す
 *  Google Fonts の <link> より後ろで読み込む（コースのページは engine/js/boot.js が読み込む）。
 * ========================================================= */
(function () {
  'use strict';
  if (!/Windows/.test(navigator.userAgent) || !window.fetch) return;

  /* Windows 用のファイル → iPhone・Android 用のファイル（fonts.gstatic.com/s/ のあと、.woff2 の前。日本語の部分は .番号 の前）
     python tools/smooth-fonts-gen.py の出力そのまま */
  var MAP = {
    'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM1y56sNz-s': 'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM1y56sNz-uEzRRL',  // M PLUS Rounded 1c 500
    'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM1y56sAz-uWzg': 'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM1y56sAz-uEzRRLclI',  // M PLUS Rounded 1c 500
    'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM1y56sJz-uWzg': 'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM1y56sJz-uEzRRLclI',  // M PLUS Rounded 1c 500
    'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM1y56sBz-uWzg': 'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM1y56sBz-uEzRRLclI',  // M PLUS Rounded 1c 500
    'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM1y56sOz-uWzg': 'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM1y56sOz-uEzRRLclI',  // M PLUS Rounded 1c 500
    'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM1y56sPz-uWzg': 'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM1y56sPz-uEzRRLclI',  // M PLUS Rounded 1c 500
    'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM1y56sCz-uWzg': 'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM1y56sCz-uEzRRLclI',  // M PLUS Rounded 1c 500
    'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM1y56sDz-uWzg': 'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM1y56sDz-uEzRRLclI',  // M PLUS Rounded 1c 500
    'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM1y55sPrfqk33YqOjLBxkUhdkeuqyIMwGYkDA': 'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM1y55sPxeymz15fQEPFwkYlR0a4qBwdyXRVeV9klkI',  // M PLUS Rounded 1c 500
    'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM064asNz-s': 'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM064asNz-uEzRRL',  // M PLUS Rounded 1c 700
    'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM064asAz-uWzg': 'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM064asAz-uEzRRLclI',  // M PLUS Rounded 1c 700
    'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM064asJz-uWzg': 'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM064asJz-uEzRRLclI',  // M PLUS Rounded 1c 700
    'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM064asBz-uWzg': 'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM064asBz-uEzRRLclI',  // M PLUS Rounded 1c 700
    'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM064asOz-uWzg': 'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM064asOz-uEzRRLclI',  // M PLUS Rounded 1c 700
    'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM064asPz-uWzg': 'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM064asPz-uEzRRLclI',  // M PLUS Rounded 1c 700
    'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM064asCz-uWzg': 'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM064asCz-uEzRRLclI',  // M PLUS Rounded 1c 700
    'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM064asDz-uWzg': 'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM064asDz-uEzRRLclI',  // M PLUS Rounded 1c 700
    'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM064ZsPrfqk33YqOjLBxkUhdkeuqyIMwGYkDA': 'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM064ZsPxeymz15fQEPFwkYlR0a4qBwdyXRVeV9klkI',  // M PLUS Rounded 1c 700
    'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM0m4qsNz-s': 'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM0m4qsNz-uEzRRL',  // M PLUS Rounded 1c 800
    'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM0m4qsAz-uWzg': 'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM0m4qsAz-uEzRRLclI',  // M PLUS Rounded 1c 800
    'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM0m4qsJz-uWzg': 'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM0m4qsJz-uEzRRLclI',  // M PLUS Rounded 1c 800
    'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM0m4qsBz-uWzg': 'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM0m4qsBz-uEzRRLclI',  // M PLUS Rounded 1c 800
    'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM0m4qsOz-uWzg': 'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM0m4qsOz-uEzRRLclI',  // M PLUS Rounded 1c 800
    'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM0m4qsPz-uWzg': 'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM0m4qsPz-uEzRRLclI',  // M PLUS Rounded 1c 800
    'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM0m4qsCz-uWzg': 'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM0m4qsCz-uEzRRLclI',  // M PLUS Rounded 1c 800
    'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM0m4qsDz-uWzg': 'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM0m4qsDz-uEzRRLclI',  // M PLUS Rounded 1c 800
    'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM0m4psPrfqk33YqOjLBxkUhdkeuqyIMwGYkDA': 'mplusrounded1c/v22/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM0m4psPxeymz15fQEPFwkYlR0a4qBwdyXRVeV9klkI',  // M PLUS Rounded 1c 800
    'delagothicone/v19/hESp6XxvMDRA-2eD0lXpDa6QkBA2QkEI': 'delagothicone/v19/hESp6XxvMDRA-2eD0lXpDa6QkBA2QkEIYgpLUQ',  // Dela Gothic One 400
    'delagothicone/v19/hESp6XxvMDRA-2eD0lXpDa6QkBA2RkEIcAk': 'delagothicone/v19/hESp6XxvMDRA-2eD0lXpDa6QkBA2RkEIYgpLUTOw',  // Dela Gothic One 400
    'delagothicone/v19/hESp6XxvMDRA-2eD0lXpDa6QkBA2QUEIcAk': 'delagothicone/v19/hESp6XxvMDRA-2eD0lXpDa6QkBA2QUEIYgpLUTOw',  // Dela Gothic One 400
    'delagothicone/v19/hESp6XxvMDRA-2eD0lXpDa6QkBA2TUEIcAk': 'delagothicone/v19/hESp6XxvMDRA-2eD0lXpDa6QkBA2TUEIYgpLUTOw',  // Dela Gothic One 400
    'delagothicone/v19/hESp6XxvMDRA-2eD0lXpDa6QkBA2TEEIcAk': 'delagothicone/v19/hESp6XxvMDRA-2eD0lXpDa6QkBA2TEEIYgpLUTOw',  // Dela Gothic One 400
    'delagothicone/v19/hESp6XxvMDRA-2eD0lXpDa6QkBAGQCMZQhgpMHvQclGQe7meVsqPbDrj6fo': 'delagothicone/v19/hESp6XxvMDRA-2eD0lXpDa6QkBAGQEsPQAgBRQGhdlWTf4ifQMmxfTPxmI8D_A6A',  // Dela Gothic One 400
    'zenkakugothicnew/v19/gNMYW2drQpDw0GjzrVNFf_valaDBcznOojxoTA': 'zenkakugothicnew/v19/gNMYW2drQpDw0GjzrVNFf_valaDBcznOojxoTE76QGE',  // Zen Kaku Gothic New 400
    'zenkakugothicnew/v19/gNMYW2drQpDw0GjzrVNFf_valaDBcznOojhoTFz5': 'zenkakugothicnew/v19/gNMYW2drQpDw0GjzrVNFf_valaDBcznOojhoTE76QGF10A',  // Zen Kaku Gothic New 400
    'zenkakugothicnew/v19/gNMYW2drQpDw0GjzrVNFf_valaDBcznOojJoTFz5': 'zenkakugothicnew/v19/gNMYW2drQpDw0GjzrVNFf_valaDBcznOojJoTE76QGF10A',  // Zen Kaku Gothic New 400
    'zenkakugothicnew/v19/gNMYW2drQpDw0GjzrVNFf_valaDBcznOkj4KXW7oIgA9sLCeNoPLhe6Lpg_IbDMC': 'zenkakugothicnew/v19/gNMYW2drQpDw0GjzrVNFf_valaDBcznOkj5iS2z4CnVHwbSaNYf6hPiImB7BfkJ3ZpFRYQ',  // Zen Kaku Gothic New 400
    'zenkakugothicnew/v19/gNMVW2drQpDw0GjzrVNFf_valaDBcznOqs9LWWPYTQ': 'zenkakugothicnew/v19/gNMVW2drQpDw0GjzrVNFf_valaDBcznOqs9LWWPYTUtP2d4',  // Zen Kaku Gothic New 500
    'zenkakugothicnew/v19/gNMVW2drQpDw0GjzrVNFf_valaDBcznOqs9LWWfYTVlM': 'zenkakugothicnew/v19/gNMVW2drQpDw0GjzrVNFf_valaDBcznOqs9LWWfYTUtP2d7DRA',  // Zen Kaku Gothic New 500
    'zenkakugothicnew/v19/gNMVW2drQpDw0GjzrVNFf_valaDBcznOqs9LWW3YTVlM': 'zenkakugothicnew/v19/gNMVW2drQpDw0GjzrVNFf_valaDBcznOqs9LWW3YTUtP2d7DRA',  // Zen Kaku Gothic New 500
    'zenkakugothicnew/v19/gNMVW2drQpDw0GjzrVNFf_valaDBcznOqs9LaWG6XGtdu7-LJIjxku6yox_CeVZufvVB': 'zenkakugothicnew/v19/gNMVW2drQpDw0GjzrVNFf_valaDBcznOqs9LaWHSSmlNk8rxVYz1keqDognBR0dnbIQ0DZlb2g',  // Zen Kaku Gothic New 500
    'zenkakugothicnew/v19/gNMVW2drQpDw0GjzrVNFf_valaDBcznOqodNWWPYTQ': 'zenkakugothicnew/v19/gNMVW2drQpDw0GjzrVNFf_valaDBcznOqodNWWPYTUtP2d4',  // Zen Kaku Gothic New 700
    'zenkakugothicnew/v19/gNMVW2drQpDw0GjzrVNFf_valaDBcznOqodNWWfYTVlM': 'zenkakugothicnew/v19/gNMVW2drQpDw0GjzrVNFf_valaDBcznOqodNWWfYTUtP2d7DRA',  // Zen Kaku Gothic New 700
    'zenkakugothicnew/v19/gNMVW2drQpDw0GjzrVNFf_valaDBcznOqodNWW3YTVlM': 'zenkakugothicnew/v19/gNMVW2drQpDw0GjzrVNFf_valaDBcznOqodNWW3YTUtP2d7DRA',  // Zen Kaku Gothic New 700
    'zenkakugothicnew/v19/gNMVW2drQpDw0GjzrVNFf_valaDBcznOqodNaWG6XGtdu7-LJIjxku6yox_CeVZufvVB': 'zenkakugothicnew/v19/gNMVW2drQpDw0GjzrVNFf_valaDBcznOqodNaWHSSmlNk8rxVYz1keqDognBR0dnbIQ0DZlb2g',  // Zen Kaku Gothic New 700
    'zenmarugothic/v20/o-0XIpIxzW5b-RxT-6A8jWAtCp-cGWtyO5Cb': 'zenmarugothic/v20/o-0XIpIxzW5b-RxT-6A8jWAtCp-cGWtyO5Cb36v1vg',  // Zen Maru Gothic 500
    'zenmarugothic/v20/o-0XIpIxzW5b-RxT-6A8jWAtCp-cGWtyP5Cbzag': 'zenmarugothic/v20/o-0XIpIxzW5b-RxT-6A8jWAtCp-cGWtyP5Cb36v1vmui',  // Zen Maru Gothic 500
    'zenmarugothic/v20/o-0XIpIxzW5b-RxT-6A8jWAtCp-cGWtyOJCbzag': 'zenmarugothic/v20/o-0XIpIxzW5b-RxT-6A8jWAtCp-cGWtyOJCb36v1vmui',  // Zen Maru Gothic 500
    'zenmarugothic/v20/o-0XIpIxzW5b-RxT-6A8jWAtCp-cGWtyNZCbzag': 'zenmarugothic/v20/o-0XIpIxzW5b-RxT-6A8jWAtCp-cGWtyNZCb36v1vmui',  // Zen Maru Gothic 500
    'zenmarugothic/v20/o-0XIpIxzW5b-RxT-6A8jWAtCp-cGWtCOfKK_7mX3yPCWUgO7n9RJZk8vDuG3WM': 'zenmarugothic/v20/o-0XIpIxzW5b-RxT-6A8jWAtCp-cGWtCOZqc_am_qlmzXUwN6k5QM5oCrTKUrBY1uqOu',  // Zen Maru Gothic 500
    'zenmarugothic/v20/o-0XIpIxzW5b-RxT-6A8jWAtCp-cUW1yO5Cb': 'zenmarugothic/v20/o-0XIpIxzW5b-RxT-6A8jWAtCp-cUW1yO5Cb36v1vg',  // Zen Maru Gothic 700
    'zenmarugothic/v20/o-0XIpIxzW5b-RxT-6A8jWAtCp-cUW1yP5Cbzag': 'zenmarugothic/v20/o-0XIpIxzW5b-RxT-6A8jWAtCp-cUW1yP5Cb36v1vmui',  // Zen Maru Gothic 700
    'zenmarugothic/v20/o-0XIpIxzW5b-RxT-6A8jWAtCp-cUW1yOJCbzag': 'zenmarugothic/v20/o-0XIpIxzW5b-RxT-6A8jWAtCp-cUW1yOJCb36v1vmui',  // Zen Maru Gothic 700
    'zenmarugothic/v20/o-0XIpIxzW5b-RxT-6A8jWAtCp-cUW1yNZCbzag': 'zenmarugothic/v20/o-0XIpIxzW5b-RxT-6A8jWAtCp-cUW1yNZCb36v1vmui',  // Zen Maru Gothic 700
    'zenmarugothic/v20/o-0XIpIxzW5b-RxT-6A8jWAtCp-cUW1COfKK_7mX3yPCWUgO7n9RJZk8vDuG3WM': 'zenmarugothic/v20/o-0XIpIxzW5b-RxT-6A8jWAtCp-cUW1COZqc_am_qlmzXUwN6k5QM5oCrTKUrBY1uqOu',  // Zen Maru Gothic 700
    'zenmarugothic/v20/o-0XIpIxzW5b-RxT-6A8jWAtCp-caW9yO5Cb': 'zenmarugothic/v20/o-0XIpIxzW5b-RxT-6A8jWAtCp-caW9yO5Cb36v1vg',  // Zen Maru Gothic 900
    'zenmarugothic/v20/o-0XIpIxzW5b-RxT-6A8jWAtCp-caW9yP5Cbzag': 'zenmarugothic/v20/o-0XIpIxzW5b-RxT-6A8jWAtCp-caW9yP5Cb36v1vmui',  // Zen Maru Gothic 900
    'zenmarugothic/v20/o-0XIpIxzW5b-RxT-6A8jWAtCp-caW9yOJCbzag': 'zenmarugothic/v20/o-0XIpIxzW5b-RxT-6A8jWAtCp-caW9yOJCb36v1vmui',  // Zen Maru Gothic 900
    'zenmarugothic/v20/o-0XIpIxzW5b-RxT-6A8jWAtCp-caW9yNZCbzag': 'zenmarugothic/v20/o-0XIpIxzW5b-RxT-6A8jWAtCp-caW9yNZCb36v1vmui',  // Zen Maru Gothic 900
    'zenmarugothic/v20/o-0XIpIxzW5b-RxT-6A8jWAtCp-caW9COfKK_7mX3yPCWUgO7n9RJZk8vDuG3WM': 'zenmarugothic/v20/o-0XIpIxzW5b-RxT-6A8jWAtCp-caW9COZqc_am_qlmzXUwN6k5QM5oCrTKUrBY1uqOu',  // Zen Maru Gothic 900
    'zenoldmincho/v14/tss0ApVaYytLwxTqcxfMyBveybbwiXw': 'zenoldmincho/v14/tss0ApVaYytLwxTqcxfMyBveybbwiXxw2d8o',  // Zen Old Mincho 400
    'zenoldmincho/v14/tss0ApVaYytLwxTqcxfMyBveybb0iXxi2g': 'zenoldmincho/v14/tss0ApVaYytLwxTqcxfMyBveybb0iXxw2d8oBxk',  // Zen Old Mincho 400
    'zenoldmincho/v14/tss0ApVaYytLwxTqcxfMyBveybbziXxi2g': 'zenoldmincho/v14/tss0ApVaYytLwxTqcxfMyBveybbziXxw2d8oBxk',  // Zen Old Mincho 400
    'zenoldmincho/v14/tss0ApVaYytLwxTqcxfMyBveybb-iXxi2g': 'zenoldmincho/v14/tss0ApVaYytLwxTqcxfMyBveybb-iXxw2d8oBxk',  // Zen Old Mincho 400
    'zenoldmincho/v14/tss0ApVaYytLwxTqcxfMyBveyYby621Qy71JT3kBgWHP-z3MekRWhFKJ1A': 'zenoldmincho/v14/tss0ApVaYytLwxTqcxfMyBveyYbyg3tS25U8NQgFhWLLyjzaeXpHjUD4ofj2HQM',  // Zen Old Mincho 400
    'zenoldmincho/v14/tss3ApVaYytLwxTqcxfMyBveyb5LrGld-9I': 'zenoldmincho/v14/tss3ApVaYytLwxTqcxfMyBveyb5LrGld-9ICPRBv',  // Zen Old Mincho 700
    'zenoldmincho/v14/tss3ApVaYytLwxTqcxfMyBveyb5LrGlZ-9IQPg': 'zenoldmincho/v14/tss3ApVaYytLwxTqcxfMyBveyb5LrGlZ-9ICPRBv3BM',  // Zen Old Mincho 700
    'zenoldmincho/v14/tss3ApVaYytLwxTqcxfMyBveyb5LrGle-9IQPg': 'zenoldmincho/v14/tss3ApVaYytLwxTqcxfMyBveyb5LrGle-9ICPRBv3BM',  // Zen Old Mincho 700
    'zenoldmincho/v14/tss3ApVaYytLwxTqcxfMyBveyb5LrGlT-9IQPg': 'zenoldmincho/v14/tss3ApVaYytLwxTqcxfMyBveyb5LrGlT-9ICPRBv3BM',  // Zen Old Mincho 700
    'zenoldmincho/v14/tss3ApVaYytLwxTqcxfMyBveyb5LrFlfmcMiL3IOlHPEwSrMQ0FGjkfsuOCSDQ': 'zenoldmincho/v14/tss3ApVaYytLwxTqcxfMyBveyb5LrFlf8dUgP1p77gLAxSnIckBQjXn9sfLjeG9rwq0',  // Zen Old Mincho 700
    'zenoldmincho/v14/tss3ApVaYytLwxTqcxfMyBveyb5zrmld-9I': 'zenoldmincho/v14/tss3ApVaYytLwxTqcxfMyBveyb5zrmld-9ICPRBv',  // Zen Old Mincho 900
    'zenoldmincho/v14/tss3ApVaYytLwxTqcxfMyBveyb5zrmlZ-9IQPg': 'zenoldmincho/v14/tss3ApVaYytLwxTqcxfMyBveyb5zrmlZ-9ICPRBv3BM',  // Zen Old Mincho 900
    'zenoldmincho/v14/tss3ApVaYytLwxTqcxfMyBveyb5zrmle-9IQPg': 'zenoldmincho/v14/tss3ApVaYytLwxTqcxfMyBveyb5zrmle-9ICPRBv3BM',  // Zen Old Mincho 900
    'zenoldmincho/v14/tss3ApVaYytLwxTqcxfMyBveyb5zrmlT-9IQPg': 'zenoldmincho/v14/tss3ApVaYytLwxTqcxfMyBveyb5zrmlT-9ICPRBv3BM',  // Zen Old Mincho 900
    'zenoldmincho/v14/tss3ApVaYytLwxTqcxfMyBveyb5zrllfmcMiL3IOlHPEwSrMQ0FGjkfsuOCSDQ': 'zenoldmincho/v14/tss3ApVaYytLwxTqcxfMyBveyb5zrllf8dUgP1p77gLAxSnIckBQjXn9sfLjeG9rwq0',  // Zen Old Mincho 900
    'shipporimincho/v17/VdGDAZweH5EbgHY6YExcZfDoj0B4L9aW45sP': 'shipporimincho/v17/VdGDAZweH5EbgHY6YExcZfDoj0B4L9aW45sPxeymzw',  // Shippori Mincho 500
    'shipporimincho/v17/VdGDAZweH5EbgHY6YExcZfDoj0B4L9aW7ZsP1-8': 'shipporimincho/v17/VdGDAZweH5EbgHY6YExcZfDoj0B4L9aW7ZsPxeymzyRK',  // Shippori Mincho 500
    'shipporimincho/v17/VdGDAZweH5EbgHY6YExcZfDoj0B4L9am4fke5f7ErmwqJDbcxmkgTEWquC8NvBI': 'shipporimincho/v17/VdGDAZweH5EbgHY6YExcZfDoj0B4L9am4ZEI5-7s2xZbIDLfwlghWkaUqSYfzWdYeCMQ',  // Shippori Mincho 500
    'shipporimincho/v17/VdGDAZweH5EbgHY6YExcZfDoj0B4Z9CW45sP': 'shipporimincho/v17/VdGDAZweH5EbgHY6YExcZfDoj0B4Z9CW45sPxeymzw',  // Shippori Mincho 700
    'shipporimincho/v17/VdGDAZweH5EbgHY6YExcZfDoj0B4Z9CW7ZsP1-8': 'shipporimincho/v17/VdGDAZweH5EbgHY6YExcZfDoj0B4Z9CW7ZsPxeymzyRK',  // Shippori Mincho 700
    'shipporimincho/v17/VdGDAZweH5EbgHY6YExcZfDoj0B4Z9Cm4fke5f7ErmwqJDbcxmkgTEWquC8NvBI': 'shipporimincho/v17/VdGDAZweH5EbgHY6YExcZfDoj0B4Z9Cm4ZEI5-7s2xZbIDLfwlghWkaUqSYfzWdYeCMQ',  // Shippori Mincho 700
    'shipporimincho/v17/VdGDAZweH5EbgHY6YExcZfDoj0B4e9OW45sP': 'shipporimincho/v17/VdGDAZweH5EbgHY6YExcZfDoj0B4e9OW45sPxeymzw',  // Shippori Mincho 800
    'shipporimincho/v17/VdGDAZweH5EbgHY6YExcZfDoj0B4e9OW7ZsP1-8': 'shipporimincho/v17/VdGDAZweH5EbgHY6YExcZfDoj0B4e9OW7ZsPxeymzyRK',  // Shippori Mincho 800
    'shipporimincho/v17/VdGDAZweH5EbgHY6YExcZfDoj0B4e9Om4fke5f7ErmwqJDbcxmkgTEWquC8NvBI': 'shipporimincho/v17/VdGDAZweH5EbgHY6YExcZfDoj0B4e9Om4ZEI5-7s2xZbIDLfwlghWkaUqSYfzWdYeCMQ',  // Shippori Mincho 800
    'shipporiminchob1/v24/wXK1E2wCr44tulPdnn-xbIpJ9RgT9-nKVo5_2XKg': 'shipporiminchob1/v24/wXK1E2wCr44tulPdnn-xbIpJ9RgT9-nKVo5_2XKgxn0Euw',  // Shippori Mincho B1 600
    'shipporiminchob1/v24/wXK1E2wCr44tulPdnn-xbIpJ9RgT9-nKVo5_13Kg1H4': 'shipporiminchob1/v24/wXK1E2wCr44tulPdnn-xbIpJ9RgT9-nKVo5_13Kgxn0Euw07',  // Shippori Mincho B1 600
    'shipporiminchob1/v24/wXK1E2wCr44tulPdnn-xbIpJ9RgT9-nKVo5P2xCx5m9m2kVb449GP2pukmm_jQafeeM': 'shipporiminchob1/v24/wXK1E2wCr44tulPdnn-xbIpJ9RgT9-nKVo5P23in5H9Orz8q54tFO1tvhGqBnA-NCJbul8nR',  // Shippori Mincho B1 600
    'shipporiminchob1/v24/wXK1E2wCr44tulPdnn-xbIpJ9RgT9-nKMo9_2XKg': 'shipporiminchob1/v24/wXK1E2wCr44tulPdnn-xbIpJ9RgT9-nKMo9_2XKgxn0Euw',  // Shippori Mincho B1 700
    'shipporiminchob1/v24/wXK1E2wCr44tulPdnn-xbIpJ9RgT9-nKMo9_13Kg1H4': 'shipporiminchob1/v24/wXK1E2wCr44tulPdnn-xbIpJ9RgT9-nKMo9_13Kgxn0Euw07',  // Shippori Mincho B1 700
    'shipporiminchob1/v24/wXK1E2wCr44tulPdnn-xbIpJ9RgT9-nKMo9P2xCx5m9m2kVb449GP2pukmm_jQafeeM': 'shipporiminchob1/v24/wXK1E2wCr44tulPdnn-xbIpJ9RgT9-nKMo9P23in5H9Orz8q54tFO1tvhGqBnA-NCJbul8nR',  // Shippori Mincho B1 700
    'shipporiminchob1/v24/wXK1E2wCr44tulPdnn-xbIpJ9RgT9-nKLox_2XKg': 'shipporiminchob1/v24/wXK1E2wCr44tulPdnn-xbIpJ9RgT9-nKLox_2XKgxn0Euw',  // Shippori Mincho B1 800
    'shipporiminchob1/v24/wXK1E2wCr44tulPdnn-xbIpJ9RgT9-nKLox_13Kg1H4': 'shipporiminchob1/v24/wXK1E2wCr44tulPdnn-xbIpJ9RgT9-nKLox_13Kgxn0Euw07',  // Shippori Mincho B1 800
    'shipporiminchob1/v24/wXK1E2wCr44tulPdnn-xbIpJ9RgT9-nKLoxP2xCx5m9m2kVb449GP2pukmm_jQafeeM': 'shipporiminchob1/v24/wXK1E2wCr44tulPdnn-xbIpJ9RgT9-nKLoxP23in5H9Orz8q54tFO1tvhGqBnA-NCJbul8nR'   // Shippori Mincho B1 800
  };
  /* url(…/s/<書体>/<版>/<ファイル>.woff2) の <書体>/<版>/<ファイル> を iPhone・Android 用に。
     日本語の部分はファイル名の末尾に .番号 が付くので、番号の前で引く */
  var URL_RE = /fonts\.gstatic\.com\/s\/([^)'"]+?)\.woff2/g;
  function swap(path) {
    if (MAP[path]) return MAP[path];
    var m = /^(.+)(\.\d+)$/.exec(path);
    return m && MAP[m[1]] ? MAP[m[1]] + m[2] : null;
  }
  var seen = {};

  function fix(link) {
    var href = link.href;
    if (seen[href]) return;
    seen[href] = 1;
    fetch(href).then(function (r) { return r.ok ? r.text() : ''; }).then(function (css) {
      /* @font-face を1つずつ見て、MAP にある書体だけ書き換えて残す（ほかの書体は今までどおり） */
      var out = css.split('}').filter(function (b) {
        var m = /fonts\.gstatic\.com\/s\/([^)'"]+?)\.woff2/.exec(b);
        return m && swap(m[1]);
      }).map(function (b) {
        return b.replace(URL_RE, function (s, path) { return 'fonts.gstatic.com/s/' + swap(path) + '.woff2'; }) + '}';
      }).join('\n');
      if (!out) return;
      var st = document.createElement('style');
      st.setAttribute('data-smooth-fonts', '');
      st.textContent = out;
      (document.head || document.documentElement).appendChild(st);
    }).catch(function () { /* 取れなければ今までどおり */ });
  }
  function scan() {
    var links = document.querySelectorAll('link[rel="stylesheet"][href^="https://fonts.googleapis.com/"]');
    for (var i = 0; i < links.length; i++) fix(links[i]);
  }
  scan();
  document.addEventListener('DOMContentLoaded', scan);
})();
