import { Fragment, useCallback, useEffect, useMemo, useState } from "react"
import { Employee } from "./utils/types"
import { InputSelect } from "./components/InputSelect"
import { TransactionPane } from "./components/TransactionPane"
import { Instructions } from "./components/Instructions"
import { useEmployees } from "./hooks/useEmployees"
import { usePaginatedTransactions } from "./hooks/usePaginatedTransactions"
import { useTransactionsByEmployee } from "./hooks/useTransactionsByEmployee"
import { EMPTY_EMPLOYEE } from "./utils/constants"
import { ViewMore } from "./components/ViewMore/Index"

export function App() {
  const { data: employees, ...employeeUtils } = useEmployees()
  const { data: paginatedTransactions, ...paginatedTransactionsUtils } = usePaginatedTransactions()
  const { data: transactionsByEmployee, ...transactionsByEmployeeUtils } = useTransactionsByEmployee()
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false)
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false)

  const transactions = useMemo(
    () => paginatedTransactions?.data ?? transactionsByEmployee ?? null,
    [paginatedTransactions, transactionsByEmployee]
  )
  const loadAllEmployees = useCallback( async () => {
    setIsLoadingEmployees(true)
    await employeeUtils.fetchAll()
    setIsLoadingEmployees(false)
  }, [employeeUtils])

  const loadAllTransactions = useCallback(async () => {
    setIsLoadingTransactions(true)
    transactionsByEmployeeUtils.invalidateData()

    await paginatedTransactionsUtils.fetchAll()

    setIsLoadingTransactions(false)
  }, [paginatedTransactionsUtils, transactionsByEmployeeUtils])

  const loadTransactionsByEmployee = useCallback(
    async (employeeId: string) => {
      paginatedTransactionsUtils.invalidateData()
      await transactionsByEmployeeUtils.fetchById(employeeId)
    },
    [paginatedTransactionsUtils, transactionsByEmployeeUtils]
  )

  useEffect(() => {
    if (employees === null && !employeeUtils.loading) {
      loadAllEmployees()
      loadAllTransactions()
    }
  }, [employeeUtils.loading, employees, loadAllEmployees, loadAllTransactions])

  return (
    <Fragment>
      <main className="MainContainer">
        <Instructions />

        <hr className="RampBreak--l" />

        <InputSelect<Employee>
          isLoading={isLoadingEmployees}
          defaultValue={EMPTY_EMPLOYEE}
          items={employees === null ? [] : [EMPTY_EMPLOYEE, ...employees]}
          label="Filter by employee"
          loadingLabel="Loading employees"
          parseItem={(item) => ({
            value: item.id,
            label: `${item.firstName} ${item.lastName}`,
          })}
          onChange={async (newValue) => {
            if (newValue === null) {
              return
            }
            if(newValue.id === "1"){
             loadAllTransactions()
            }

            await loadTransactionsByEmployee(newValue.id)
          }}
        />

        <div className="RampBreak--l" />

        <div className="RampGrid">
          {transactions === null ? (
            <div className="RampLoading--container">Loading...</div>
          ) : (
            <Fragment>
              <div data-testid="transaction-container">
                {transactions.map((transaction) => (
                  <TransactionPane key={transaction.id} transaction={transaction} />
                ))}
              </div>
              <ViewMore
                empId ={transactions.length} 
                disabled={paginatedTransactionsUtils.loading}
                onClick={async () => {
                  await loadAllTransactions() 
                  }} />
            </Fragment>
          )}
        </div>
      </main>
    </Fragment>
  )
}
