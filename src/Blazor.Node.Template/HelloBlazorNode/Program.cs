using System;
using System.Threading.Tasks;
using Blazor.Node;
using Microsoft.Extensions.DependencyInjection;

namespace HelloBlazorNode
{
    public class Program : ProgramBase
    {
        public static Task Main() => new Program().BaseMain();

        public override void ConfigureServices(IServiceCollection services)
        {
            // register the services required by the program
        }

        public override async Task Execute(IServiceProvider serviceProvider)
        {
            Console.WriteLine("Hello from Blazor Node. Exiting in 3 seconds.");
            await Task.Delay(3000);
            Console.WriteLine("Goodbye.");
        }
    }
}
