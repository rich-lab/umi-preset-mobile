import flex from 'umi-hd/lib/flex';
import vw from 'umi-hd/lib/vw';

const { clientWidth } = document.documentElement;

if (clientWidth > 750) {
  vw(100, 750);
} else {
  flex();
}

// 告知 antdm 2.x 当前已经使用高清方案
document.documentElement.setAttribute('data-scale', 'true');
