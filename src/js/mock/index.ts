import mock from 'mockjs';
import { MainHost } from '../api/constants';
import { LabelTreeData } from './label-tree-data';
function mockLabelTree() {
  mock.mock(new RegExp(`${MainHost}/label/tree($|\\?.*)`), {
    code: 0,
    data: LabelTreeData,
    message: 'success'
  })
}

export function mockAllData() {
  mockLabelTree();
}