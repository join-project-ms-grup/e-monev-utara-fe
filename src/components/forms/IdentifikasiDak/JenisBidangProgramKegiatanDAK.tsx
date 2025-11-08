import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getChildren, getUrusan } from '../../../services/RekeningService';
import InputSearchBox from '../../inputs/InputSearchBox';
import InputText from '../../inputs/InputText';

interface PilihanParent {
  urusan?: string;
  bidang?: string;
  program?: string;
  kegiatan?: string;
  subkegiatan?: string;
}

const JenisBidangProgramKegiatanDAK = () => {
  const initPilihanParent: PilihanParent = {
    urusan: '',
    bidang: '',
    program: '',
    kegiatan: '',
    subkegiatan: '',
  };

  const [pilihanParent, setPilihanParent] = useState(initPilihanParent);

  const getListQuery = (key: string, parentId?: string) =>
    useQuery({
      queryKey: [key, parentId],
      queryFn: () => (parentId ? getChildren(Number(parentId)) : getUrusan()),
      enabled: key === 'listUrusan' || !!parentId,
    });

  const { data: dataUrusan } = getListQuery('listUrusan');
  const { data: dataBidang } = getListQuery('listBidang', pilihanParent.urusan);
  const { data: dataProgram } = getListQuery(
    'listProgram',
    pilihanParent.bidang,
  );
  const { data: dataKegiatan } = getListQuery(
    'listKegiatan',
    pilihanParent.program,
  );
  const { data: dataSubKegiatan } = getListQuery(
    'listSubKegiatan',
    pilihanParent.kegiatan,
  );

  const mapList = (data?: any[]) =>
    data?.map((item) => ({
      label: `[${item.kode} - ${item.id}] ${item.name}`,
      value: item.id?.toString(),
    })) || [];

  const listUrusan = mapList(dataUrusan);
  const listBidang = mapList(dataBidang);
  const listProgram = mapList(dataProgram);
  const listKegiatan = mapList(dataKegiatan);
  const listSubKegiatan = mapList(dataSubKegiatan);

  // const [selectedRek, setSelectedRek] = useState('');

  const levelKeys = [
    'urusan',
    'bidang',
    'program',
    'kegiatan',
    'subkegiatan',
  ] as const;

  useEffect(() => {
    const updatedPilihan: PilihanParent = { ...pilihanParent };
    let foundEmpty = false;

    for (const key of levelKeys) {
      if (foundEmpty) {
        updatedPilihan[key] = '';
      } else if (updatedPilihan[key] === '') {
        foundEmpty = true;
      }
    }

    if (JSON.stringify(updatedPilihan) !== JSON.stringify(pilihanParent)) {
      setPilihanParent(updatedPilihan);
    }

    // handleParentChange(updatedPilihan);
  // }, [pilihanParent, selectedRek]);
  }, [pilihanParent]);

  const handleChangeLevel = (level: keyof PilihanParent, value: string) => {
    const levelIndex = levelKeys.indexOf(level);

    const updated: PilihanParent = { ...pilihanParent };
    updated[level] = value;

    for (let i = levelIndex + 1; i < levelKeys.length; i++) {
      updated[levelKeys[i]] = '';
    }

    setPilihanParent(updated);
  };

  // const handleParentChange = ({
  //   urusan,
  //   bidang,
  //   program,
  //   kegiatan,
  //   subkegiatan,
  // }: PilihanParent) => {
  //   let parentValue = '';

  //   switch (selectedRek) {
  //     case 'program':
  //       if (urusan && bidang && program) parentValue = program;
  //       break;

  //     case 'kegiatan':
  //       if (urusan && bidang && program && kegiatan) parentValue = kegiatan;
  //       break;

  //     case 'subKegiatan':
  //       if (urusan && bidang && program && kegiatan && subkegiatan)
  //         parentValue = subkegiatan;
  //       break;

  //     default:
  //       parentValue = '';
  //   }
  // };

  return (
    <div>
      <div className='flex items-center mb-4'>
        <h5 className='whitespace-nowrap mr-3'>
          Jenis, Bidang, Program & Kegiatan DAK
        </h5>
        <div className='flex-grow h-px bg-[var(--color-3)]'></div>
      </div>

      <input type='hidden' name='idak_jenis' value='1' />
      <div className='space-y-2'>
        <div className='grid lg:grid-cols-3 gap-2'>
          <div>
            <label htmlFor='subJenisDak'>Sub-Jenis DAK</label>
            <InputSearchBox
              id='subJenisDak'
              className='h-9'
              btnclassName='bg-white'
              options={[]}
              placeholder='Pilih Sub-Jenis DAK'
            />
          </div>
          <div>
            <label htmlFor='bidangDak'>Bidang DAK</label>
            <InputSearchBox
              id='bidangDak'
              className='h-9'
              btnclassName='bg-white'
              options={[]}
              placeholder='Pilih Bidang DAK'
            />
          </div>
          <div>
            <label htmlFor='subBidangDak'>Sub-Bidang DAK</label>
            <InputSearchBox
              id='subBidangDak'
              className='h-9'
              btnclassName='bg-white'
              options={[]}
              placeholder='Pilih Sub-Bidang DAK'
            />
          </div>
        </div>
        {/*  */}
        <div className='grid lg:grid-cols-[1fr_2fr_2fr] gap-2'>
          <div>
            <label htmlFor='tahun'>Tahun</label>
            <InputSearchBox
              id='tahun'
              className='h-9'
              btnclassName='bg-white'
              options={[]}
              placeholder='Pilih Tahun'
            />
          </div>
          <div>
            <label htmlFor='iskpd'>OPD</label>
            <InputSearchBox
              id='iskpd'
              className='h-9'
              btnclassName='bg-white'
              options={[]}
              placeholder='Pilih OPD'
            />
          </div>
          <div>
            <label htmlFor='bidang_skpd'>Bidang OPD</label>
            <InputText id='bidang_skpd' placeholder='Bidang OPD...' />
          </div>
        </div>
        <div className='space-y-2'>
          <div>
            <label htmlFor='urusan'>Urusan</label>
            <InputSearchBox
              id='urusan'
              className='h-9'
              btnclassName='bg-white'
              options={listUrusan}
              value={pilihanParent.urusan}
              onChange={(e) => handleChangeLevel('urusan', e)}
              onClear={() => handleChangeLevel('urusan', '')}
              withSearch
              placeholder='Pilih Urusan'
            />
          </div>
          <div>
            <label htmlFor='bidang'>Bidang</label>
            <InputSearchBox
              id='bidang'
              className='h-9'
              btnclassName='bg-white'
              options={listBidang}
              value={pilihanParent.bidang}
              onChange={(e) => handleChangeLevel('bidang', e)}
              onClear={() => handleChangeLevel('bidang', '')}
              withSearch
              placeholder='Pilih Bidang'
              disabled={!pilihanParent.urusan}
            />
          </div>
          <div>
            <label htmlFor='program'>Program</label>
            <InputSearchBox
              id='program'
              className='h-9'
              btnclassName='bg-white'
              options={listProgram}
              withSearch
              value={pilihanParent.program}
              onChange={(e) => handleChangeLevel('program', e)}
              onClear={() => handleChangeLevel('program', '')}
              placeholder='Pilih Program'
              disabled={!pilihanParent.bidang}
            />
          </div>
          <div>
            <label htmlFor='kegiatan'>Kegiatan</label>
            <InputSearchBox
              id='kegiatan'
              className='h-9'
              btnclassName='bg-white'
              options={listKegiatan}
              value={pilihanParent.kegiatan}
              onChange={(e) => handleChangeLevel('kegiatan', e)}
              onClear={() => handleChangeLevel('kegiatan', '')}
              withSearch
              placeholder='Pilih Kegiatan'
              disabled={!pilihanParent.program}
            />
          </div>
          <div>
            <label htmlFor='subKegiatan'>Sub Kegiatan</label>
            <InputSearchBox
              id='subKegiatan'
              className='h-9'
              btnclassName='bg-white'
              options={listSubKegiatan}
              value={pilihanParent.subkegiatan}
              onChange={(e) => handleChangeLevel('subkegiatan', e)}
              onClear={() => handleChangeLevel('subkegiatan', '')}
              withSearch
              placeholder='Pilih Sub Kegiatan'
              disabled={!pilihanParent.kegiatan}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JenisBidangProgramKegiatanDAK;
