var fs = require('fs-extra');
var request = require('request');
var path = require('path');
var pg = require('pg');
var knex = require('knex');
var connectString = process.env.DATABASE_URL || 'postgres://localhost:5432/closet';

//insert users
function postUser(username, password){
  pg.connect(connectString, function (err, client, done){
    if(err){
      console.error(err);
    }
    client.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, password], function (err, result){
      if(err){
        console.log('database error on signup')
        console.error(err);
      } else {
        done();
      }
  });
});
}

//insert images

function postImage(img_url, username, file_name, clothing_type){
  request(img_url)
  .pipe(fs.createWriteStream(path.join(__dirname, '/client/uploads/' + file_name)));

  pg.connect(connectString, function (err, client, done){
    if(err){
      console.error('error connecting to the DB:', err);
    }
    client.query('SELECT user_id FROM users WHERE username = $1', [username], function(err, result){
      if(err){
        console.error('error on lookup of user id:', err)
      }
      else {
        var user_id = result.rows[0].user_id;
        client.query('INSERT INTO images (image_name, user_id, type_id) VALUES ($1, $2, $3)', [file_name, user_id, clothing_type], function (err, result){
          if(err){
            console.error(err);
          } else {
            done();
          }
        })
      }
    });
  });
}
postUser('kanye', 'kanye'); 
postUser('oliver', 'oliver');
postUser('jlaw', 'jlaw');
postUser('doge', 'doge');
postUser('natalie', 'natalie');

setTimeout(function(){
//kanye
postImage('http://i.perezhilton.com/wp-content/uploads/2014/10/kanye-west-celine-paris-fashion-week-2014-getty(1)__iphone_640.jpg', 'kanye', 'kanye1.jpg', 4); 
postImage('http://cdn.styleblazer.com/wp-content/uploads/2013/11/AG018286_05.jpg', 'kanye', 'kanye2.jpg', 4);
postImage('http://www.laughoutnews.com/wp-content/gallery/photo-battle/254.jpg', 'kanye', 'kanye3.jpg', 4);
postImage('http://static.stuff.co.nz/1440063509/478/12467478.jpg', 'kanye', 'kanye4.jpg', 3);
postImage('http://g01.a.alicdn.com/kf/HTB1cEn7KpXXXXXHXVXXq6xXFXXXR/Jogger-pants-reentrant-pants-high-quality-slim-font-b-leather-b-font-pants-kanye-font-b.jpg', 'kanye', 'kanye5.jpg', 2);

//oliver
postImage('http://onedapperstreet.com/wordpress/wp-content/uploads/2015/12/Hub-Hardy-Coach_151226-800x1199.jpg', 'oliver', 'oliver10.jpg', 4);
postImage('http://onedapperstreet.com/wordpress/wp-content/uploads/2015/12/Boglioli_151221_2-800x1199.jpg', 'oliver', 'oliver9.jpg', 4);
postImage('http://onedapperstreet.com/wordpress/wp-content/uploads/2015/12/Club-Monaco-Final-20151202_0005-800x1000.jpg', 'oliver', 'oliver8.jpg', 4);
postImage('http://onedapperstreet.com/wordpress/wp-content/uploads/2015/12/Lined_151214-800x1199.jpg', 'oliver', 'oliver7.jpg', 4);
postImage('http://onedapperstreet.com/wordpress/wp-content/uploads/2015/04/PONY_edit_3-800x534.jpg', 'oliver', 'oliver6.jpg', 3);
postImage('http://onedapperstreet.com/wordpress/wp-content/uploads/2014/10/Unknown-800x835.jpeg', 'oliver', 'oliver5.jpg', 1);
postImage('http://4.bp.blogspot.com/-RJRs6m9X2NA/UlowFnzcxII/AAAAAAAAFSA/U61ygoz0Dk8/s1600/Stone+Island_131002_8962Edit.jpg', 'oliver', 'oliver4.jpg', 1);
postImage('http://i.stpost.com/carhartt-washed-twill-work-pants-for-men-in-dark-khaki~p~3657w_03~1500.3.jpg', 'oliver', 'oliver3.jpg', 2);
postImage('http://g02.a.alicdn.com/kf/HTB1EqLyHVXXXXc9XXXXq6xXFXXXi/2013-Four-Seasons-font-b-Military-b-font-font-b-Cargo-b-font-font-b-Pants.jpg', 'oliver', 'oliver2.jpg', 2);
postImage('https://shoesaurboots.files.wordpress.com/2012/05/1289388730-30308600.jpg', 'oliver', 'oliver1.jpg', 3);


//jlaw
postImage('http://i4.cdnds.net/13/17/300x600/wenn20301936.jpg', 'jlaw', 'jlaw1.jpg', 4);
postImage('http://shilpaahuja.com/wp-content/uploads/2015/12/jennifer-lawrence-hunger-games-look-outfit-red-dress-fighter-costume-mockingjay-2.jpg', 'jlaw', 'jlaw2.jpg', 4);
postImage('http://www.becauseiamfabulous.com/wp-content/uploads/2013/01/Jennifer-Lawrence-dress-shoes-print-Prabal-Gurung-2013-AFI-Awards-5.jpg', 'jlaw', 'jlaw3.jpg', 3);
postImage('http://www4.pictures.zimbio.com/mp/-6o3ufhQQ6fl.jpg', 'jlaw', 'jlaw4.jpg', 1);

//natalie
postImage('http://3.bp.blogspot.com/-y2rSq8LNrBo/Vh5Qg4Y70yI/AAAAAAAAPcE/pphu-4XVynw/s1600/chronicles-of-her-blue-denim-shorts-nobody-skyline02.jpg', 'natalie', 'natalie1.jpg', 4);
postImage('http://3.bp.blogspot.com/-SsKozErB1Zs/VhXYclog0MI/AAAAAAAAPVo/oSuSL9RcLbs/s1600/chronicles-of-her-new-york-5th-avenue-stripe-midi-dress-04.jpg', 'natalie', 'natalie2.jpg', 1);
postImage('http://4.bp.blogspot.com/-PkjfaDcb-rY/VWGVqnSgZFI/AAAAAAAAPE8/JEGX-GVE67g/s1600/grey-chunky-rib-knit-sweater-high-neck-chronicles-of-her-02.jpg', 'natalie', 'natalie3.jpg', 2);
postImage('https://s-media-cache-ak0.pinimg.com/originals/28/bd/14/28bd145960de17cf6786f2d487659c99.jpg', 'natalie', 'natalie4.jpg', 2);
postImage('http://ikuzolady.com/wp-content/uploads/2014/08/Ladies-Skirts.jpg', 'natalie', 'natalie5.jpg', 2);
postImage('http://www.yomister.com/image/data/0/nike-all/Nike-Air-Max-Womens/Nike-Air-Max-90-VT/Nike-Air-Max-90-Womens-Shoes-Fur-2014-Releases-Red-New-Arrival-2803_1.jpg', 'natalie', 'natalie6.jpg', 3);

// doge
postImage('http://36.media.tumblr.com/f957743ff14799093ebf643bb92da499/tumblr_o0hrgfaHMM1s4yg05o1_1280.jpg', 'doge', 'doge1.jpg', 4);
postImage('http://36.media.tumblr.com/09e65c4f16f11443d54dcafc63914d32/tumblr_nz1ps2GSyf1s4yg05o1_500.jpg', 'doge', 'doge2.jpg', 4);
postImage('http://36.media.tumblr.com/dc9f903d7dc0e5cb21a528a52675c830/tumblr_ny58zfyOVo1s4yg05o1_500.jpg', 'doge', 'doge3.jpg', 4);
postImage('http://41.media.tumblr.com/2f3eada9bc10adf6c4a18d60ea2977d7/tumblr_nve69vTwFK1s4yg05o1_500.jpg', 'doge', 'doge4.jpg', 4);
postImage('http://41.media.tumblr.com/1c7379228376a3b41daad84e7de100bf/tumblr_numwg6mEzv1s4yg05o1_500.jpg', 'doge', 'doge5.jpg', 4);
postImage('http://41.media.tumblr.com/98c9ce01da05c28d4589d8e154887642/tumblr_nuldwqtk061s4yg05o1_500.jpg', 'doge', 'doge6.jpg', 4);
postImage('http://40.media.tumblr.com/caa954a2eef1927165b68dd3d7d4f63f/tumblr_nvk1n0zsZp1s4yg05o1_500.jpg', 'doge', 'doge7.jpg', 4);
postImage('http://41.media.tumblr.com/b2dee668cfe812b6420206e464c4c586/tumblr_nqvsb1SzDa1s4yg05o1_500.jpg', 'doge', 'doge8.jpg', 4);
}, 5000);
//insert vote 
