import Axios from 'axios';
import _ from 'lodash';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import allTagsReducer, { fetchAllTags, fetchAllTagsSuccess, fetchAllTagsFail } from './allTags';

jest.mock('axios');

describe('Test allTags', () => {
  const err = new Error('fail to fetch tags');

  describe('Test allTagsSlice', () => {
    it('Test actionCreator', () => {
      const data = [
        { id: 1, name: 'file1', tags: ['tag1'] },
        { id: 2, name: 'file2', tags: ['tag2'] },
      ];
      const onSuccess = fetchAllTagsSuccess(data);
      const onFail = fetchAllTagsFail(err.message);

      expect(onSuccess).toEqual({
        type: 'allTags/fetchAllTagsSuccess',
        payload: data,
      });

      expect(onFail).toEqual({
        type: 'allTags/fetchAllTagsFail',
        payload: err.message,
      });
    });

    it('Test reducer', () => {
      const initialState = [];

      const tags = [
        '2016년',
        '2018년',
        '6월',
        '11월',
      ];

      const actionCreators = [
        fetchAllTagsSuccess,
        fetchAllTagsFail,
      ];

      const exps = [
        {
          error: null,
          tags,
        },

        {
          error: err.message,
          tags: [],
        },
      ];

      const args = [tags, err.message];

      _.forEach(_.zip(actionCreators, exps, args), _.spread((actionCreator, exp, arg) => {
        const state = allTagsReducer(initialState, actionCreator(arg));
        expect(state).toEqual(exp);
      }));
    });
  });

  describe('Test fetch function', () => {
    const mockStore = configureStore([thunk]);

    const tags = [
      '2016년',
      '2018년',
      '6월',
      '11월',
    ];

    it('when success', () => {
      const store = mockStore({});
      Axios.get.mockImplementationOnce(() => Promise.resolve({
        data: { tags },
      }));

      return (
        store.dispatch(fetchAllTags())
          .then(() => {
            const actions = store.getActions();
            expect(actions[0]).toEqual(
              {
                type: 'allTags/fetchAllTagsSuccess',
                payload: tags,
              },
            );
          })
      );
    });

    it('when fails', () => {
      const store = mockStore({});
      Axios.get.mockImplementationOnce(() => Promise.reject(err));

      return (
        store.dispatch(fetchAllTags())
          .then(() => {
            const actions = store.getActions();
            expect(actions[0]).toEqual(
              {
                type: 'allTags/fetchAllTagsFail',
                payload: err.message,
              },
            );
          })
      );
    });
  });
});
