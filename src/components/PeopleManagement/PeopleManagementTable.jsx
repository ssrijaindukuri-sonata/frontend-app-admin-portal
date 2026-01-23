import React from 'react';
import { CardView, DataTable } from '@openedx/paragon';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import TableTextFilter from '../learner-credit-management/TableTextFilter';
import CustomDataTableEmptyState from '../learner-credit-management/CustomDataTableEmptyState';
import OrgMemberCard from './OrgMemberCard';
import useEnterpriseMembersTableData from './data/hooks/useEnterpriseMembersTableData';
import DownloadCsvButton from './DownloadCSVButton';

const FilterStatus = (rest) => (
  <DataTable.FilterStatus showFilteredFields={false} {...rest} />
);

const PeopleTableFilter = (props) => {
  const { column } = props;
  const { learnersTabEnabled } = column;

  return (
    <TableTextFilter
      {...props}
      placeholder={learnersTabEnabled ? 'Search by learner details' : 'Search by name'}
      aria-label={learnersTabEnabled ? 'Search by learner details' : 'Search by name'}
    />
  );
};

PeopleTableFilter.propTypes = {
  column: PropTypes.shape({
    learnersTabEnabled: PropTypes.bool.isRequired,
  }).isRequired,
};

const PeopleManagementTable = ({ enterpriseId, learnersTabEnabled }) => {
  const {
    isLoading,
    enterpriseMembersTableData,
    fetchEnterpriseMembersTableData,
    fetchAllEnterpriseMembersData,
  } = useEnterpriseMembersTableData({ enterpriseId });

  const tableColumns = [
    {
      Header: learnersTabEnabled ? 'Learner details' : 'Name',
      accessor: 'name',
      learnersTabEnabled,
    },
  ];

  return (
    <DataTable
      isSortable
      manualSortBy
      isPaginated
      manualPagination
      isFilterable
      manualFilters
      isLoading={isLoading}
      columns={tableColumns}
      defaultColumnValues={{
        Filter: PeopleTableFilter,
      }}
      FilterStatusComponent={FilterStatus}
      numBreakoutFilters={2}
      initialState={{
        pageSize: 10,
        pageIndex: 0,
        sortBy: [{ id: 'name', desc: true }],
        filters: [],
      }}
      fetchData={fetchEnterpriseMembersTableData}
      data={enterpriseMembersTableData.results}
      itemCount={enterpriseMembersTableData.itemCount}
      pageCount={enterpriseMembersTableData.pageCount}
      EmptyTableComponent={CustomDataTableEmptyState}
      tableActions={[
        <DownloadCsvButton
          fetchData={fetchAllEnterpriseMembersData}
          totalCt={enterpriseMembersTableData.itemCount}
          testId="people-report-download"
        />,
      ]}
    >
      <DataTable.TableControlBar />
      <CardView
        className="d-block"
        CardComponent={OrgMemberCard}
        columnSizes={{ xs: 12 }}
      />
      <DataTable.TableFooter />
    </DataTable>
  );
};

PeopleManagementTable.propTypes = {
  enterpriseId: PropTypes.string.isRequired,
  learnersTabEnabled: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  enterpriseId: state.portalConfiguration.enterpriseId,
  learnersTabEnabled: state.portalConfiguration.enterpriseFeatures?.enterprise_invite_admins_enabled,
  // learnersTabEnabled: true,
});

export default connect(mapStateToProps)(PeopleManagementTable);
