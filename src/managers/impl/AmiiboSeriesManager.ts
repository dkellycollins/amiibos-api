import * as _ from 'lodash';
import {injectable, inject} from 'inversify';
import {IAmiiboSeries} from '../../models';
import {TYPES} from '../../types';
import {IAmiiboSeriesManager, IAmiiboSeriesSearchCriteria, ICreateAmiiboSeriesInfo} from '../IAmiiboSeriesManager';

@injectable()
export class AmiiboSeriesManager implements IAmiiboSeriesManager {

  constructor(
    @inject(TYPES.Models.AmiiboSeriesModel) private _amiiboSeriesModel: any) {

  }

  public async search(criteria: IAmiiboSeriesSearchCriteria): Promise<IAmiiboSeries[]> {
    return await this._amiiboSeriesModel.findAll(criteria);
  }

  public async resolve(infos: ICreateAmiiboSeriesInfo[]): Promise<IAmiiboSeries[]> {
    const promises = _.map(infos, async (info) => {
      var series = await this.search({name: info.name});

      if(_.isEmpty(series)) {
        return await this._amiiboSeriesModel.create(info);
      }

      const id = series[0]._id;
      return await this._amiiboSeriesModel.update(id, {
        displayName: info.displayName
      });
    });

    return await Promise.all(promises);
  }

  public async remove(name: string): Promise<void> {
    return await this._amiiboSeriesModel.destroyAll({
      name: name
    });
  }
}