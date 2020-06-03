! function() {
    //获取元素。
    const gamebox = document.querySelector('.gamebox');
    const oEm = document.querySelector('em');
    let zscore = 0;


    //1.背景运动
    let bgposition = 0;
    let bgtimer = setInterval(() => {
        bgposition += 2;
        gamebox.style.backgroundPosition = `0 ${bgposition}px`;
    }, 1000 / 60);

    //2.定义角色的类-被继承
    class role {
        //角色的属性
        constructor(w, h, x, y, imgurl, boomurl) { //参数
                this.w = w; //宽
                this.h = h; //高
                this.x = x; //水平位置
                this.y = y; //垂直位置
                this.imgurl = imgurl; //图片路径
                this.boomurl = boomurl; //爆炸图片路径
            }
            //创建角色 - 创建图片
        createrole() {
            this.roleimg = document.createElement('img');
            this.roleimg.src = this.imgurl;
            this.roleimg.style.cssText = `width:${this.w}px;height:${this.h}px;position:absolute;left:${this.x}px;top:${this.y}px;`;
            gamebox.appendChild(this.roleimg);
        }
    }


    //3.我发飞机的类--继承
    class myplane extends role {
        constructor(w, h, x, y, imgurl, boomurl) {
            super(w, h, x, y, imgurl, boomurl); //继承属性+方法
            this.createrole(); //继承来的
            this.myplanemove(); //飞机移动
            this.myplaneshoot(); //发射子弹
        }

        myplanemove() {
            //键盘：W:87 A:65 S：83 D:68  K:75 进行移动  
            //0 - 9  Unicode 48 - 57
            //A - Z unicode  65 - 90
            //a -z unicode   97-122
            let _this = this;
            let uptimer = null;
            let downtimer = null;
            let lefttimer = null;
            let righttimer = null;
            let uplock = true;
            let downlock = true;
            let leftlock = true;
            let rightlock = true;
            //按下键盘对于的事件绑定
            document.addEventListener('keydown', planemove, false); //事件绑定。 planemove：事件处理函数
            function planemove(ev) {
                var ev = ev || window.event;
                switch (ev.keyCode) {
                    case 87:
                        moveup();
                        break;
                    case 83:
                        movedown();
                        break;
                    case 65:
                        moveleft();
                        break;
                    case 68:
                        moveright();
                        break;
                }
                //不同方向的运动
                //同时按住对立的方向，我方飞机不知道怎么走，取保每次一个方向运动。
                function moveup() {
                    if (uplock) {
                        uplock = false;
                        clearInterval(downtimer);
                        uptimer = setInterval(() => {
                            _this.y -= 4; //改变top值
                            if (_this.y <= 0) {
                                _this.y = 0;
                            }
                            _this.roleimg.style.top = _this.y + 'px';

                        }, 1000 / 60);
                    }

                }

                function movedown() {
                    if (downlock) {
                        downlock = false;
                        clearInterval(uptimer);
                        downtimer = setInterval(() => {
                            _this.y += 4; //改变top值
                            if (_this.y >= gamebox.offsetHeight - _this.h) {
                                _this.y = gamebox.offsetHeight - _this.h;
                            }
                            _this.roleimg.style.top = _this.y + 'px';

                        }, 1000 / 60);
                    }

                }

                function moveleft() {
                    if (leftlock) {
                        leftlock = false;
                        clearInterval(righttimer);
                        lefttimer = setInterval(() => {
                            _this.x -= 4; //改变top值
                            if (_this.x < 0) {
                                _this.x = 0;
                            }
                            _this.roleimg.style.left = _this.x + 'px';

                        }, 1000 / 60);
                    }

                }

                function moveright() {
                    if (rightlock) {
                        rightlock = false;
                        clearInterval(lefttimer);
                        righttimer = setInterval(() => {
                            _this.x += 4; //改变top值
                            if (_this.x >= gamebox.offsetWidth - _this.w) {
                                _this.x = gamebox.offsetWidth - _this.w;
                            }
                            _this.roleimg.style.left = _this.x + 'px';

                        }, 1000 / 60);
                    }

                }
            }

            //松开键盘对于的事件
            document.addEventListener('keyup', function(ev) {
                var ev = ev || window.event;
                if (ev.keyCode === 87) {
                    clearInterval(uptimer);
                    uplock = true;
                }

                if (ev.keyCode === 83) {
                    clearInterval(downtimer);
                    downlock = true;
                }
                if (ev.keyCode === 65) {
                    clearInterval(lefttimer);
                    leftlock = true;
                }
                if (ev.keyCode === 68) {
                    clearInterval(righttimer);
                    rightlock = true;
                }
            });



        }

        myplaneshoot() {
            let _this = this;
            let shoottimer = null;
            let shootlock = true;
            document.addEventListener('keydown', planeshoot, false);

            function planeshoot(ev) {
                var ev = ev || window.event;
                if (ev.keyCode === 75) { //按下k键,一个子弹就是一个子弹类的实例对象
                    if (shootlock) {
                        shootlock = false;
                        //每次按下产生一个子弹，按住不放，每隔200ms产生一个子弹
                        function shoot() {
                            new bullet(6, 14, _this.x + _this.w / 2 - 3, _this.y - 14, 'img/bullet.png');
                        }
                        shoottimer = setInterval(shoot, 200); //按住不放
                        shoot(); //按下松开
                    }
                }
            }

            document.addEventListener('keyup', function(ev) {
                var ev = ev || window.event;
                if (ev.keyCode === 75) {
                    clearInterval(shoottimer);
                    shootlock = true;
                }
            });
        }
    }

    //4.子弹的类
    class bullet extends role {
        constructor(w, h, x, y, imgurl) {
            super(w, h, x, y, imgurl);
            this.createrole(); //继承来的
            this.bulletmove(); //子弹运动
        }

        bulletmove() {
            this.timer = setInterval(() => {
                this.y -= 4;
                if (this.y === -this.h) { //判断子弹是否消失
                    clearInterval(this.timer); //关闭子弹的定时自
                    gamebox.removeChild(this.roleimg); //移出子弹
                }
                this.roleimg.style.top = this.y + 'px';
                this.bullethit(); //子弹碰撞敌机
            }, 1000 / 60);
        }
        bullethit() {
            const enemys = document.querySelectorAll('.enemy');
            for (let i = 0; i < enemys.length; i++) {
                if (this.x + this.w >= enemys[i].offsetLeft && this.x <= enemys[i].offsetLeft + enemys[i].offsetWidth && this.y + this.h >= enemys[i].offsetTop && this.y <= enemys[i].offsetTop + enemys[i].offsetHeight) {
                    clearInterval(this.timer); //子弹停止运动
                    try {
                        gamebox.removeChild(this.roleimg); //如果子弹刚好碰到两架敌机，每次碰撞删除子弹，此时会报错。容错处理。
                    } catch (e) {
                        return;
                    }
                    enemys[i].blood--; //血量减1
                    enemys[i].checkblood(); //每一个敌机身上都有一个检测血量的方法。
                }
            }
        }
    }

    //5.敌方飞机的类
    class enemyplane extends role {
        constructor(w, h, x, y, imgurl, boomurl, blood, score, speed) { //参数
            super(w, h, x, y, imgurl, boomurl) //继承
            this.blood = blood;
            this.score = score;
            this.speed = speed;
            this.createrole(); //创建角色
            this.enemyplaneattribute(); //敌机身上绑定属性
            this.enemyplanemove(); //敌机移动
        }
        enemyplanemove() {
            this.roleimg.timer = setInterval(() => {
                this.y += this.speed;
                if (this.y >= gamebox.offsetHeight) {
                    clearInterval(this.roleimg.timer);
                    gamebox.removeChild(this.roleimg);
                }
                this.roleimg.style.top = this.y + 'px';
                this.enemyplanehit(); //敌机碰撞我方飞机
            }, 1000 / 60)
        }
        enemyplaneattribute() {
            let _this = this;
            this.roleimg.className = 'enemy';
            this.roleimg.blood = this.blood;
            this.roleimg.score = this.score;
            this.roleimg.checkblood = function() { //绑定方法，方法里面this指向this.roleimg,当前的敌机
                //this->当前的敌机this.roleimg
                if (this.blood === 0) { //满足条件敌机消失。
                    this.className = '';
                    this.src = _this.boomurl;
                    clearInterval(this.timer);
                    setTimeout(() => {
                        gamebox.removeChild(this);
                    }, 300);
                    //赋值分数。
                    zscore += this.score;
                    oEm.innerHTML = zscore;
                }
            }
        }

        enemyplanehit() {
            if (this.x + this.w >= ourplane.x && this.x <= ourplane.x + ourplane.w && this.y + this.h >= ourplane.y && this.y <= ourplane.y + ourplane.h) {
                const enemys = document.querySelectorAll('.enemy');
                for (let i = 0; i < enemys.length; i++) {
                    clearInterval(enemys[i].timer);
                }
                clearInterval(bgtimer);
                clearInterval(timer);
                ourplane.roleimg.src = ourplane.boomurl;
                setTimeout(() => {
                    alert('game over!!');
                    location.reload(true);
                }, 300);
            }
        }
    }

    //敌机有三种(实例对象)，大飞机，中飞机，小飞机。
    //随机产生1-20之间的数。
    let timer = setInterval(() => {
        let num = rannum(1, 20); //随机产生1-20之间的数
        if (num >= 1 && num <= 15) {
            new enemyplane(34, 24, rannum(0, gamebox.offsetWidth - 34), -24, 'img/smallplane.png', 'img/smallplaneboom.gif', 1, 1, rannum(1, 3));
        } else if (num > 15 && num < 20) {
            new enemyplane(46, 60, rannum(0, gamebox.offsetWidth - 46), -60, 'img/midplane.png', 'img/midplaneboom.gif', 3, 5, rannum(1, 2));
        } else if (num === 20) {
            new enemyplane(110, 164, rannum(0, gamebox.offsetWidth - 110), -164, 'img/bigplane.png', 'img/bigplaneboom.gif', 10, 100, 1);
        }
    }, 3000);

    function rannum(min, max) {
        return Math.round(Math.random() * (max - min)) + min;
    }


    let ourplane = new myplane(66, 80, (gamebox.offsetWidth - 66) / 2, gamebox.offsetHeight - 80, 'img/myplane.gif', 'img/myplaneBoom.gif');

}();